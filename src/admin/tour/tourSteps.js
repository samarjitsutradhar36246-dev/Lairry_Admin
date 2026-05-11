// src/admin/tour/tourSteps.js

export const tourSteps = {
"/admin": [
  {
    element: "#tour-topbar-theme",
    popover: {
      title: "🌙 Theme Toggle",
      description: "Switch between light and dark mode. Your preference is saved automatically.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "#tour-topbar-notifications",
    popover: {
      title: "🔔 Notifications",
      description: "Admin notifications appear here. Unread ones show a red badge. Click any notification to mark it as read.",
      side: "bottom",
      align: "end",
    },
  },
{
  element: "#tour-topbar-help",
  popover: {
    title: "❓ Help & Tour",
    description: "That's this button! Click it anytime on any page to get a guided tour of whatever section you're currently viewing. Never get lost again.",
    side: "bottom",
    align: "end",
  },
},

  {
    element: "#tour-topbar-profile",
    popover: {
      title: "👤 Your Profile",
      description: "Click here to view and edit your admin profile, change your password, or update your details.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "#tour-sidebar-toggle",
    popover: {
      title: "📂 Sidebar Menu",
      description: "Click this to open the navigation sidebar. Access all sections of the dashboard from there — institutes, students, revenue, and more.",
      side: "top",
      align: "start",
    },
  },
  {
    element: "#tour-kpi-row-1",
    popover: {
      title: "📊 Key Metrics",
      description: "Top-level KPIs — total students, institutes, exams listed, and queries raised.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-kpi-row-2",
    popover: {
      title: "📈 Growth Metrics",
      description: "Enrolled students, active institutes, feedbacks and bad reviews with growth % vs your selected period.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#tour-delta-dropdown",
    popover: {
      title: "📅 Growth Period",
      description: "Compare KPI growth vs Yesterday, Last 7 Days, or Last 30 Days.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "#tour-map",
    popover: {
      title: "🗺️ Institute Location Map",
      description: "Visual map of all registered institutes across regions.",
      side: "top",
      align: "start",
    },
  },
  {
    element: "#tour-recent-activity",
    popover: {
      title: "🕐 Recent Activity",
      description: "Recent admin logins and newly activated institute accounts for quick monitoring.",
      side: "left",
      align: "start",
    },
  },
  {
    element: "#tour-financial",
    popover: {
      title: "💰 Financial Overview",
      description: "Quick preview of revenue and financial analytics. Click into it for full charts.",
      side: "top",
      align: "start",
    },
  },
  {
    element: "#tour-students-preview",
    popover: {
      title: "🎓 Students Preview",
      description: "Snapshot of recent student activity. Go to Students Management for the full list.",
      side: "top",
      align: "start",
    },
  },
  {
    element: "#tour-institutes-preview",
    popover: {
      title: "🏫 Institutes Preview",
      description: "Quick view of institute data. Head to Institutes Management for detailed controls.",
      side: "top",
      align: "start",
    },
  },
],




  // ── Institutes (full page) ──────────────────────────────────────────
  "/admin/institutes-management": [
    {
      element: "#tour-institutes-header",
      popover: {
        title: "🏫 Institutes Management",
        description: "This is your central hub for managing all institutes on the platform. Add, edit, suspend, or monitor any institute from here.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#tour-institutes-search",
      popover: {
        title: "🔍 Search & Filter",
        description: "Search institutes by name, city, status, or email. Use the Sort dropdown to order by name or revenue. Results update as you type.",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#tour-institutes-export",
      popover: {
        title: "📥 Export CSV",
        description: "Download the current institute list as a CSV file. Great for reporting or sharing data with your team.",
        side: "bottom",
        align: "end",
      },
    },
    {
      element: "#tour-institutes-add",
      popover: {
        title: "➕ Add Institute",
        description: "Register a new institute. A temporary password is auto-generated and a welcome email is sent to them automatically.",
        side: "bottom",
        align: "end",
      },
    },
    {
      element: "#tour-institutes-table",
      popover: {
        title: "📋 Institutes Table",
        description: "All institutes are listed here. Click any row to view the profile. Use the checkbox to select one or more institutes for bulk actions.",
        side: "top",
        align: "start",
      },
    },
    {
      element: "#tour-institutes-bulk",
      popover: {
        title: "⚡ Bulk Actions",
        description: "Once you select institutes, this panel appears. You can suspend accounts, send emails, or push notifications to all selected institutes at once.",
        side: "bottom",
        align: "start",
      },
    },
  ],

  // add inside tourSteps

"add-institute-modal": [
  {
    element: "#tour-basic-info",
    popover: {
      title: "Basic Information",
      description: "Fill all basic institute details in this section.",
      side: "bottom",
      align: "start"
    }
  },
  {
    element: "#tour-email-info",
    popover: {
      title: "Email Information",
      description: "Provide official and communication email details.",
      side: "bottom",
      align: "start"
    }
  },
  {
    element: "#tour-contact-info",
    popover: {
      title: "Contact Information",
      description: "Add phone numbers and contact person details.",
      side: "bottom",
      align: "start"
    }
  },
  {
    element: "#tour-location-details",
    popover: {
      title: "Location Details",
      description: "Enter address and location related information.",
      side: "bottom",
      align: "start"
    }
  },
  {
    element: "#tour-map-picker",
    popover: {
      title: "Map Location Picker",
      description: "Pick the exact institute location on the map.",
      side: "top",
      align: "start"
    }
  },
  {
    element: "#tour-admin-notes",
    popover: {
      title: "Admin Notes",
      description: "Add internal notes for administrators.",
      side: "top",
      align: "start"
    }
  },
      {
      element: "#tour-add-save",
      popover: {
        title: "Save institute",
        description:
          "After filling all the required details, click Save. Once saved, the institute will receive an invitation to join the platform.",
        side: "top",
        align: "end"
      }
    }
],

};

