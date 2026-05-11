import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase/SupabaseClient";
import * as XLSX from "xlsx";
import { useSupabase } from "../../supabase/SupabaseProvider";

export default function Queue() {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("PENDING_APPROVAL");
  const [reason, setReason] = useState("");
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [parsingErrors, setParsingErrors] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const { user } = useSupabase();

  // Fetch all requests based on filter
  useEffect(() => {
    async function fetchRequests() {
      let query = supabase.from("institute_exam_requests").select("*");

      if (filter !== "ALL") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (!error) setRequests(data);
    }
    fetchRequests();
  }, [filter, selected]);

  // Reset Excel-related state whenever a new request is selected
  useEffect(() => {
    if (!selected) return;

    setParsedQuestions([]);
    setParsingErrors([]);
    setIsParsing(false);
    setReason("");
  }, [selected]);

  // Reject exam
  const rejectTestPaper = async () => {
    if (!selected || !reason) return;

    try {
      const { error } = await supabase
        .from("institute_exam_requests")
        .update({
          status: "REJECTED",
          rejection_reason: reason,
          reviewed_at: new Date().toISOString(),
          reviewed_by_admin: user.id,
        })
        .eq("id", selected.id);

      if (error) {
        console.error("Failed to reject exam:", error.message);
        return;
      }

      setSelected(null);
      setReason("");

      setRequests((prev) =>
        prev.map((r) => (r.id === selected.id ? { ...r, status: "REJECTED", rejection_reason: reason } : r))
      );
      alert("Exam rejected successfully!");
    } catch (err) {
      console.error("Error rejecting exam:", err);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING_APPROVAL: {
        label: "Pending",
        className: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-500/30",
      },
      APPROVED: {
        label: "Approved",
        className: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500/30",
      },
      REJECTED: {
        label: "Rejected",
        className: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/30",
      },
    };
    const badge = badges[status] || { label: status, className: "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300" };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  const FIXED_FIELDS = [
    "test_paper_name",
    "institute_name",
    "status",
    "submitted_at",
    "reviewed_at",
    "rejection_reason",
    "excel_file_path",
  ];

  const EXCLUDE_FIELDS = [
    "id",
    "reviewed_by_admin",
    "test_paper_id",
  ];

  const parseExcel = async () => {
    if (!selected) return;

    setIsParsing(true);
    setParsingErrors([]);
    setParsedQuestions([]);

    try {
      const res = await fetch(selected.excel_file_path);
      const arrayBuffer = await res.arrayBuffer();

      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      if (!rows.length) throw new Error("Excel file is empty.");

      const REQUIRED_COLUMNS = [
        "Sl No",
        "Question Text",
        "Options",
        "Correct Options",
        "Positive Mark",
        "Negative Mark",
        "Expected Time (seconds)",
      ];

      const missingColumns = REQUIRED_COLUMNS.filter(col => !(col in rows[0]));
      if (missingColumns.length > 0)
        throw new Error(`Missing columns: ${missingColumns.join(", ")}`);

      const errors = [];
      const questions = [];

      rows.forEach((row, index) => {
        const slNo = Number(row["Sl No"]);

        if (!slNo || isNaN(slNo)) return;

        const questionNumber = slNo;

        const question = row["Question Text"]?.toString().trim();
        const options = row.Options
          ?.toString()
          .split(",")
          .map(opt => opt.trim())
          .filter(Boolean) || [];

        const correctOptions = row["Correct Options"]
          .toString()
          .split(",")
          .map(c => {
            const index = c.trim().toUpperCase().charCodeAt(0) - 65;
            return options[index];
          })
          .filter(Boolean);

        const positiveMark = Number(row["Positive Mark"]);
        const negativeMark = Number(row["Negative Mark"]);
        const expectedTime = Number(row["Expected Time (seconds)"]);

        const instruction = row.Instruction?.toString().trim() || "";
        const chapterName = row["Chapter Name"]?.toString().trim() || "";
        const topicName = row["Topic Name"]?.toString().trim() || "";

        const type = options.length > 0 ? "MCQ" : "DIRECT";

        if (!question) errors.push(`Q${questionNumber}: Question is required.`);
        if (options.length === 0 && type === "MCQ")
          errors.push(`Q${questionNumber}: At least one option is required.`);
        if (correctOptions.length === 0)
          errors.push(`Q${questionNumber}: Correct answer(s) are required.`);

        const invalidCorrect = correctOptions.some(c => !options.includes(c));
        if (invalidCorrect && type === "MCQ")
          errors.push(
            `Q${questionNumber}: Correct answer(s) must match one of the options.`
          );

        if (isNaN(positiveMark) || positiveMark < 0)
          errors.push(`Q${questionNumber}: Positive Mark must be a non-negative number.`);
        if (isNaN(negativeMark))
          errors.push(`Q${questionNumber}: Negative Mark must be a valid number.`);
        if (isNaN(expectedTime) || expectedTime <= 0)
          errors.push(`Q${questionNumber}: Expected Time must be a positive number.`);

        questions.push({
          sl_no: slNo,
          question,
          instruction,
          options,
          correct: correctOptions,
          type,
          positive_mark: positiveMark,
          negative_mark: negativeMark,
          expected_time_seconds: expectedTime,
          chapter_name: chapterName,
          topic_name: topicName,
        });
      });

      setParsingErrors(errors.length ? errors : []);
      setParsedQuestions(questions);
    } catch (err) {
      console.error(err);
      setParsingErrors([err.message || "Failed to parse Excel."]);
    } finally {
      setIsParsing(false);
    }
  };

  const buildTestPaperPayload = (selected) => {
    console.log("🧩 buildTestPaperPayload → selected:", selected);

    const payload = {
      test_paper_name: selected.test_paper_name,
      test_paper_description: selected.test_paper_description,
      test_paper_rules: selected.test_paper_rules,
      test_paper_marking_scheme: selected.test_paper_marking_scheme,
      total_marks: selected.total_marks,
      total_time_per_test_paper_in_minute:
        selected.total_time_per_test_paper_in_minute,
      test_paper_language: selected.test_paper_language,
      price_per_test: selected.price_per_test,
      discount_percent: selected.discount_percent,
      coupon_code: selected.coupon_code,
      test_paper_difficulty: selected.test_paper_difficulty,
      total_questions_per_test_paper: selected.total_questions,
    };

    console.log("📦 Test paper payload built:", payload);
    return payload;
  };

  const buildQuestionInsertPayload = (testPaperId) => {
    console.log("🧩 buildQuestionInsertPayload → testPaperId:", testPaperId);
    console.log("📋 parsedQuestions:", parsedQuestions);

    const payload = parsedQuestions.map((q, index) => {
      const row = {
        test_paper_id: testPaperId,
        question_text: q.question,
        options: q.options,
        question_instruction: q.instruction,
        correct_option_s: q.correct,
        positive_mark: q.positive_mark,
        negative_mark: q.negative_mark,
        expected_time_for_each_question: q.expected_time_seconds,
        chapter_name: q.chapter_name,
        topic_name: q.topic_name,
      };

      console.log(`📝 Question payload [${index}]`, row);
      return row;
    });

    console.log("📦 Final question insert payload:", payload);
    return payload;
  };

  const approveTestPaper = async () => {
    console.log("🚀 approveExam triggered");
    console.log("📌 selected:", selected);
    console.log("📌 parsedQuestions count:", parsedQuestions.length);
    console.log("📌 parsingErrors:", parsingErrors);

    if (!selected) {
      console.warn("⚠️ No selected request");
      return;
    }

    if (parsedQuestions.length === 0) {
      alert("Parse the Excel first.");
      return;
    }

    if (parsingErrors.length > 0) {
      alert("Fix parsing errors first.");
      return;
    }

    try {
      console.log("➡️ Step 1: Inserting test paper metadata");

      const testPaperPayload = buildTestPaperPayload(selected);

      const { data: testPaperData, error: testPaperError } =
        await supabase
          .from("subject_test_paper_data")
          .insert(testPaperPayload)
          .select()
          .single();

      console.log("🧪 Test paper insert response:", {
        data: testPaperData,
        error: testPaperError,
      });

      if (testPaperError) {
        console.error("❌ Test paper insert failed:", testPaperError);
        alert("Failed to create test paper");
        return;
      }

      const testPaperId = testPaperData.id;
      console.log("✅ Test paper created with ID:", testPaperId);

      console.log("➡️ Step 2: Inserting questions");

      const questionPayload = buildQuestionInsertPayload(testPaperId);

      const { data: questionData, error: questionError } =
        await supabase
          .from("subject_test_paper_questions")
          .insert(questionPayload)
          .select();

      console.log("🧪 Question insert response:", {
        data: questionData,
        error: questionError,
      });

      if (questionError) {
        console.error("❌ Question insert failed:", questionError);
        console.warn("↩️ Rolling back test paper:", testPaperId);

        const rollbackRes = await supabase
          .from("subject_test_paper_data")
          .delete()
          .eq("id", testPaperId);

        console.log("🧹 Rollback response:", rollbackRes);

        alert("Question insert failed. Rolled back.");
        return;
      }

      console.log("✅ Questions inserted successfully");

      console.log("➡️ Step 3: Updating exam request status");

      const { error: approveError } =
        await supabase
          .from("institute_exam_requests")
          .update({
            status: "APPROVED",
            reviewed_at: new Date().toISOString(),
            reviewed_by_admin: user.id,
            test_paper_id: testPaperId,
          })
          .eq("id", selected.id);

      console.log("🧪 Approval update response:", approveError);

      if (approveError) {
        console.error("❌ Approval update failed:", approveError);
        alert("Approval update failed");
        return;
      }

      console.log("🎉 Exam approved successfully");
      alert("Exam approved successfully ✅");
      setSelected(null);

    } catch (err) {
      console.error("🔥 Unexpected error in approveExam:", err);
      alert("Unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Admin Test Paper Queue</h2>
            <p className="text-gray-600 dark:text-slate-400 text-sm">
              Review and manage institute Test Paper submissions in real-time
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-start md:items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Test Paper Requests</h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400">Filter by status</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* Pending Filter */}
            <button
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-all duration-200 ${
                filter === "PENDING_APPROVAL"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40"
                  : "bg-white dark:bg-slate-800/50 text-gray-700 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 border border-gray-200 dark:border-slate-700/50"
              }`}
              onClick={() => setFilter("PENDING_APPROVAL")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6l4 2m-4-12a9 9 0 100 18 9 9 0 000-18z"
                />
              </svg>
              <span>Pending</span>
            </button>

            <button
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-all duration-200 ${
                filter === "APPROVED"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                  : "bg-white dark:bg-slate-800/50 text-gray-700 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 border border-gray-200 dark:border-slate-700/50"
              }`}
              onClick={() => setFilter("APPROVED")}
            >
              <span className="text-base md:text-lg">✓</span>
              <span>Approved</span>
            </button>

            <button
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-all duration-200 ${
                filter === "REJECTED"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
                  : "bg-white dark:bg-slate-800/50 text-gray-700 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 border border-gray-200 dark:border-slate-700/50"
              }`}
              onClick={() => setFilter("REJECTED")}
            >
              <span className="text-base md:text-lg">✕</span>
              <span>Rejected</span>
            </button>

            {/* All Filter */}
            <button
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-all duration-200 ${
                filter === "ALL"
                  ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
                  : "bg-white dark:bg-slate-800/50 text-gray-700 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 border border-gray-200 dark:border-slate-700/50"
              }`}
              onClick={() => setFilter("ALL")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
                />
              </svg>
              <span>All</span>
            </button>
          </div>
        </div>

        {/* Table Container - Modern Glass Effect */}
        <div className="relative overflow-hidden rounded-2xl 
          bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 
          backdrop-blur-xl 
          border border-gray-200 dark:border-slate-700/50 
          shadow-xl dark:shadow-2xl">
          
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 
            bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 
            dark:from-cyan-500/5 dark:via-transparent dark:to-purple-500/5 
            pointer-events-none" />

          {requests.length === 0 ? (
            <div className="relative py-20 text-center">
              <div className="text-6xl mb-4 opacity-30">📭</div>
              <p className="text-lg text-gray-500 dark:text-slate-500 capitalize">
                No {filter.toLowerCase().replace("_", " ")} Test Paper found
              </p>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                      Test Paper Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                      Institute
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                      Submitted At
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                      Reviewed At
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                      Rejection Reason
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-800/50">
                  {requests.map((r, index) => (
                    <tr
                      key={r.id}
                      className="transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-slate-800/30"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white max-w-xs truncate">
                        {r.test_paper_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-slate-300">{r.institute_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-slate-300">
                        {r.submitted_at ? new Date(r.submitted_at).toLocaleString() : "-"}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(r.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-slate-300">
                        {r.reviewed_at ? new Date(r.reviewed_at).toLocaleString() : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-slate-300 max-w-xs truncate">
                        {r.rejection_reason || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {filter === "PENDING_APPROVAL" ? (
                          <button
                            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-cyan-500/25 hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-200"
                            onClick={() => setSelected(r)}
                          >
                            Review
                          </button>
                        ) : (
                          <button
                            className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors duration-200"
                            onClick={() => setSelected(r)}
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal/Panel */}
      {selected && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setSelected(null)}
          />

          {/* Slide-in Panel - Modern Glass Effect */}
          <div className="fixed top-16 right-0 bottom-0 w-full max-w-2xl 
            bg-gradient-to-br from-white to-gray-50 dark:from-slate-900/95 dark:to-slate-800/95 
            backdrop-blur-xl 
            border-l border-gray-200 dark:border-slate-800/50 
            shadow-2xl z-50 overflow-y-auto animate-slide-in">
            
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 
              bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 
              dark:from-cyan-500/5 dark:via-transparent dark:to-purple-500/5 
              pointer-events-none" />

            {/* Panel Header */}
            <div className="relative bg-gradient-to-r from-cyan-500/20 to-blue-500/20 dark:from-cyan-500/20 dark:to-blue-500/20 
              border-b border-cyan-200 dark:border-cyan-500/30 px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review Test Paper</h2>
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Evaluate and take action on this submission</p>
              </div>
              <button
                className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white rounded-lg text-xl font-bold transition-all duration-200"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Panel Content */}
            <div className="relative p-8">
              {/* Info Section */}
              <div className="space-y-6 mb-8">
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-slate-700/50">
                  <label className="block text-xs font-bold text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-2">
                    Test Paper Name
                  </label>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{selected.test_paper_name}</p>
                </div>

                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-slate-700/50">
                  <label className="block text-xs font-bold text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-2">
                    Institute
                  </label>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{selected.institute_name}</p>
                </div>

                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-slate-700/50">
                  <label className="block text-xs font-bold text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-2">
                    Status
                  </label>
                  <div>{getStatusBadge(selected.status)}</div>
                </div>

                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-slate-700/50">
                  <label className="block text-xs font-bold text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-2">
                    Submitted At
                  </label>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {selected.submitted_at
                      ? new Date(selected.submitted_at).toLocaleString()
                      : "-"}
                  </p>
                </div>

                {selected.reviewed_at && (
                  <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-slate-700/50">
                    <label className="block text-xs font-bold text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-2">
                      Reviewed At
                    </label>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {new Date(selected.reviewed_at).toLocaleString()}
                    </p>
                  </div>
                )}

                {selected.rejection_reason && (
                  <div className="bg-red-50 dark:bg-red-500/10 backdrop-blur-sm rounded-xl p-5 border border-red-200 dark:border-red-500/30">
                    <label className="block text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
                      Rejection Reason
                    </label>
                    <p className="text-base font-medium text-red-700 dark:text-red-300">
                      {selected.rejection_reason}
                    </p>
                  </div>
                )}

                {/* Test Paper Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selected)
                    .filter(
                      ([key, value]) =>
                        !FIXED_FIELDS.includes(key) &&
                        !EXCLUDE_FIELDS.includes(key) &&
                        value !== null &&
                        value !== ""
                    )
                    .map(([key, value]) => {
                      const label = key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase());

                      return (
                        <div
                          key={key}
                          className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-slate-700/50"
                        >
                          <label className="block text-xs font-bold text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-2">
                            {label}
                          </label>
                          <p className="text-base font-medium text-gray-900 dark:text-white">
                            {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
                          </p>
                        </div>
                      );
                    })}
                </div>

                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-slate-700/50">
                  <label className="block text-xs font-bold text-gray-600 dark:text-slate-500 uppercase tracking-wider mb-3">
                    Excel File
                  </label>
                  <a
                    href={selected.excel_file_path}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <span className="text-xl">📥</span>
                    <span>Download Excel File</span>
                  </a>
                </div>
              </div>

              {/* Action Section */}
              {filter === "PENDING_APPROVAL" && (
                <div className="space-y-4 pt-8 border-t border-gray-200 dark:border-slate-800/50">
                  <button
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-base font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200"
                    onClick={parseExcel}
                    disabled={isParsing}
                  >
                    {isParsing ? "Parsing..." : "Parse Excel"}
                  </button>

                  {parsedQuestions.map((q) => (
                    <div
                      key={q.sl_no}
                      className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-slate-700/50 mb-4"
                    >
                      <p className="text-gray-900 dark:text-white font-semibold mb-2">
                        Q{q.sl_no}: {q.question}
                      </p>

                      {q.instruction && (
                        <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
                          <span className="font-semibold text-cyan-600 dark:text-cyan-400">Instruction: </span>
                          {q.instruction}
                        </p>
                      )}

                      {(q.chapter_name || q.topic_name) && (
                        <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
                          <span className="font-semibold text-gray-700 dark:text-slate-400">Chapter: </span>
                          {q.chapter_name || "-"} | <span className="font-semibold text-gray-700 dark:text-slate-400">Topic: </span>
                          {q.topic_name || "-"}
                        </p>
                      )}

                      {q.type === "MCQ" && (
                        <ul className="text-gray-700 dark:text-slate-300 ml-4 mt-2 list-disc">
                          {q.options.map((opt, i) => (
                            <li
                              key={i}
                              className={q.correct.includes(opt) ? "text-green-600 dark:text-green-400 font-bold" : ""}
                            >
                              {opt.match(/^[A-D]\.\s/) ? opt : `${String.fromCharCode(65 + i)}. ${opt}`}
                            </li>
                          ))}
                        </ul>
                      )}

                      {q.type === "DIRECT" && (
                        <p className="mt-2 text-gray-700 dark:text-slate-300">
                          <span className="font-semibold text-cyan-600 dark:text-cyan-400">Answer: </span>
                          {q.correct.join(", ")}
                        </p>
                      )}

                      <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
                        Positive Mark: {q.positive_mark} | Negative Mark: {q.negative_mark} | Expected Time: {q.expected_time_seconds} sec
                      </p>
                    </div>
                  ))}

                  {parsingErrors.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-500/10 backdrop-blur-sm rounded-xl p-6 border border-red-200 dark:border-red-500/30 mb-6">
                      <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-3">Excel Validation Errors</h3>
                      <ul className="list-disc list-inside space-y-2 text-red-700 dark:text-red-200 text-sm max-h-60 overflow-y-auto">
                        {parsingErrors.map((err, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="font-semibold">{idx + 1}.</span>
                            <span>{err}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {parsedQuestions.length === 0 && parsingErrors.length === 0 && (
                    <p className="mb-3 text-sm text-yellow-600 dark:text-yellow-400 font-semibold">
                      ⚠️ Parse Excel first before approving the test paper
                    </p>
                  )}

                  {parsingErrors.length > 0 && (
                    <p className="mb-3 text-sm text-red-600 dark:text-red-400 font-semibold">
                      ❌ Fix the Excel validation errors to approve the test paper
                    </p>
                  )}

                  <button
                    className={`w-full flex items-center justify-center gap-2 px-6 py-4 text-base font-bold rounded-xl transition-all duration-200
                      ${
                        parsedQuestions.length === 0 || parsingErrors.length > 0
                          ? "bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-slate-400 cursor-not-allowed opacity-60"
                          : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40"
                      }`}
                    onClick={approveTestPaper}
                    disabled={parsedQuestions.length === 0 || parsingErrors.length > 0}
                  >
                    <span className="text-xl">✓</span>
                    <span>Approve Test Paper</span>
                  </button>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter rejection reason..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 border-2 border-gray-300 dark:border-slate-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      className={`w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-base font-bold rounded-xl shadow-lg transition-all duration-200 ${
                        reason
                          ? "hover:from-red-600 hover:to-red-700 shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                      onClick={rejectTestPaper}
                      disabled={!reason}
                    >
                      <span className="text-xl">✕</span>
                      <span>Reject Test Paper</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}