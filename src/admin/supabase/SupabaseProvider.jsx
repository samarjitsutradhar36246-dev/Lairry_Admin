import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "./SupabaseClient";

/* ---------------------------------------------
   1. Create Context
--------------------------------------------- */
const SupabaseContext = createContext(null);

/* ---------------------------------------------
   2. Provider Component
--------------------------------------------- */
export const SupabaseProvider = ({ children }) => {
  const [user, setUser] = useState(null); // FULL ADMIN ROW
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncingRef = useRef(false); // prevents double DB calls

  /* ---------------------------------------------
     ADMIN DB SYNC (SOURCE OF TRUTH)
  --------------------------------------------- */
  const syncUserToDatabase = async (authUser, source = "unknown") => {
    if (!authUser) return;
    // console.log('heelo,i/m refresh');
    // prevent double syncing
    // console.log(authUser);
    if (syncingRef.current) return;
    syncingRef.current = true;

    // HARD SAFETY: ensure loading ends
    let timeoutId = setTimeout(() => {
      setLoading(false);
      syncingRef.current = false;
    }, 5000);

    try {
      const { data, error } = await supabase
        .from("admin")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle(); // safer than .single()

      if (error || !data) {
        await supabase.auth.signOut();
        setUser(null);
        return;
      }

      if (data.role !== "admin") {
        await supabase.auth.signOut();
        setUser(null);
        return;
      }

      setUser(data);
    } catch {
      setUser(null);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
      syncingRef.current = false;
    }
  };

  /* ---------------------------------------------
     AUTH INIT + LISTENER
  --------------------------------------------- */
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      setSession(session);

      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }

      // DO NOT sync here, wait for AUTH EVENT
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);

      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }

      // wait for token to be ready, safe DB sync
      // setTimeout(() => {
      syncUserToDatabase(session.user, event);
      // }, 0);
    });

    return () => subscription.unsubscribe();
  }, []);

  // SupabaseProvider.jsx

  /* ---------------------------------------------
     AUTH FUNCTIONS
  --------------------------------------------- */
  const registerUser = async ({ email, password, fullName, termsAccepted }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    const authUser = data.user;

    const { error: dbError } = await supabase.from("admin").insert({
      id: authUser.id,
      email,
      full_name: fullName,
      role: "admin",
      terms_accepted: termsAccepted,
    });

    if (dbError) {
      await supabase.auth.signOut();
      throw dbError;
    }

    return authUser;
  };

  // s helper
  const sendWelcomeNotificationIfFirstLogin = async (adminId) => {
    // Check the flag
    const { data, error } = await supabase
      .from("admin")
      .select("has_seen_welcome_notification")
      .eq("id", adminId)
      .maybeSingle();

    if (error || !data) return;

    if (!data.has_seen_welcome_notification) {
      // Insert welcome notification
      await supabase.from("admin_notifications").insert({
        admin_id: adminId,
        title: "Welcome to the Admin Dashboard 👋",
        description:
          "Great to have you here. This dashboard gives you full visibility into your platform — from student enrollments and institute management to revenue and AI insights. Pro tip: click the ❓ icon in the top bar whenever you need a guided walkthrough of the page you're on.",
        type: "info",
        is_important: true,
      });

      // Mark as seen so it never fires again
      await supabase
        .from("admin")
        .update({ has_seen_welcome_notification: true })
        .eq("id", adminId);
    }
  };

  const loginUser = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    // console.log(data);
    await syncUserToDatabase(data.user, "LOGIN");
    await sendWelcomeNotificationIfFirstLogin(data.user.id);

    // ---------------------------
    // NEW: Record login activity
    // ---------------------------
    const deviceInfo = {
      fingerprint: `${navigator.userAgentData?.platform || "unknown"}-${navigator.userAgent?.match(/(Chrome|Firefox|Safari|Edge)/)?.[0] || "unknown"}`,
      os: navigator.userAgentData?.platform || "unknown",
      browser:
        navigator.userAgent?.match(/(Chrome|Firefox|Safari|Edge)/)?.[0] ||
        "unknown",
    };

    console.log("device info:", deviceInfo);

    const { error: insertError } = await supabase
      .from("admin_login_activity")
      .insert({
        admin_id: data.user.id,
        admin_name: data.user.user_metadata?.full_name || data.user.email,
        admin_email: data.user.email,
        device_info: deviceInfo,
      });
    if (insertError) {
      console.log("Failed to insert login activity:", insertError);
    } else {
      console.log("login success");
    }

    return data;
  };

  const logoutUser = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  /* ---------------------------------------------
     CONTEXT VALUE
  --------------------------------------------- */
  const value = { user, session, loading, registerUser, loginUser, logoutUser };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

/* ---------------------------------------------
   3. Custom Hook
--------------------------------------------- */
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context)
    throw new Error("useSupabase must be used inside SupabaseProvider");
  return context;
};
