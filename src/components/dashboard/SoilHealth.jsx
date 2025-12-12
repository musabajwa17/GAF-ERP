"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  FileText,
  X,
} from "lucide-react";
import * as XLSX from "xlsx";

export default function SoilHealthTracker() {
  const [mode, setMode] = useState("upload");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ pH: "", EC: "", N: "", P: "", K: "" });
  const [aiData, setAiData] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [savedReports, setSavedReports] = useState([]);
  const [modalData, setModalData] = useState(null);

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  useEffect(() => {
    // Load saved reports from localStorage
    const reports = JSON.parse(localStorage.getItem("soilReportsList") || "[]");
    setSavedReports(reports);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const ext = selectedFile.name.toLowerCase().split(".").pop();
    const validExts = ["pdf", "csv", "xlsx", "xls"];
    if (!validExts.includes(ext)) {
      alert("Please upload PDF, CSV, or Excel file (.xlsx, .xls)");
      e.target.value = null;
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File too large! Max 10MB");
      e.target.value = null;
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setResult(null);
  };

  const extractTextFromPDF = async (file) => {
    const pdfParse = (await import("pdf-parse")).default;
    const buffer = await file.arrayBuffer();
    const data = await pdfParse(buffer);
    return data.text;
  };

  const extractTextFromExcelOrCSV = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: "array" });
        let text = "";
        workbook.SheetNames.forEach((sheet) => {
          text += XLSX.utils.sheet_to_csv(workbook.Sheets[sheet]) + "\n";
        });
        resolve(text);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const extractDataFromGemini = async (text) => {
    const prompt = `You are a senior soil scientist. Analyze the soil report and return ONLY JSON:

{
  "extracted_values": {"pH": null,"EC": null,"N": null,"P": null,"K": null},
  "overall_status": "",
  "recommendations": []
}
Report:
${text}`;

    try {
      const res = await fetch(
         `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await res.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found from Gemini");
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        extracted_values: parsed.extracted_values,
        overall_status: parsed.overall_status,
        recommendations: parsed.recommendations,
      };
    } catch (err) {
      console.error(err);
      alert("Gemini failed to read the report.");
      return null;
    }
  };

  const onSubmitFile = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const ext = file.name.split(".").pop().toLowerCase();
      let text = ext === "pdf" ? await extractTextFromPDF(file) : await extractTextFromExcelOrCSV(file);
      if (!text.trim()) throw new Error("No text found in file");

      const ai = await extractDataFromGemini(text);
      if (!ai) return;

      setAiData(ai);
      setFormData(ai.extracted_values);

      const avgPH = ai.extracted_values.pH;
      const soilHealth = avgPH >= 6 && avgPH <= 7.5 ? "Good" : avgPH > 7.5 ? "Fair" : "Poor";

      setResult({
        status: "success",
        analysis: { averagePH: avgPH, soilHealth },
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveResult = () => {
    if (!result || !aiData) return;
    const newReport = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      extracted_values: aiData.extracted_values,
      overall_status: aiData.overall_status,
      recommendations: aiData.recommendations,
      soilHealth: result.analysis.soilHealth,
      averagePH: result.analysis.averagePH,
    };
    const updatedReports = [newReport, ...savedReports];
    setSavedReports(updatedReports);
    localStorage.setItem("soilReportsList", JSON.stringify(updatedReports));
    alert("Report saved!");
    localStorage.removeItem("overall_status")
    localStorage.removeItem("recommendations")
    localStorage.removeItem("averagePH")
    window.location.reload()
  };

  return (
    <div className=" bg-gradient-to-br from-green-50 to-green-50 py-8 px-4 relative">
      {/* Saved Reports Drawer Button */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed cursor-pointer top-32 right-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
      >
        Saved Reports
      </button>

      {/* Main UI */}
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
          {/* Upload Section */}
          {mode === "upload" && (
            <div className="space-y-6">
              <div className="border-3 border-dashed p-12 rounded-xl text-center bg-gray-50">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium mb-4">Upload Soil Test Report (PDF, Excel, CSV)</p>
                <input
                  type="file"
                  accept=".pdf,.csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-lg">
                  Choose File
                </label>
                {fileName && <div className="mt-4 text-green-600 flex justify-center gap-2"><FileText />{fileName}</div>}
              </div>
              <button
                onClick={onSubmitFile}
                disabled={loading || !file}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl text-base font-bold shadow-xl hover:shadow-2xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300"
              >
                {loading ? "Processing..." : "Analyze Report"}
              </button>
            </div>
          )}

          {/* Result Section */}
          {result && aiData && (
            <div className="mt-10 p-6 bg-gradient-to-br from-green-50 to-green-50 border rounded-xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <CheckCircle2 className="text-green-600" /> Soil Health Analysis
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow text-center">
                  <p className="text-gray-600 font-medium">pH Level</p>
                  <p className="text-4xl font-bold text-green-600 mt-2">{result.analysis.averagePH}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow text-center">
                  <p className="text-gray-600 font-medium">Overall Health</p>
                  <p className={`text-4xl font-bold mt-2 ${
                    result.analysis.soilHealth === "Good"
                      ? "text-green-600"
                      : result.analysis.soilHealth === "Fair"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}>{result.analysis.soilHealth}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow mt-6">
                <h4 className="font-bold text-lg mb-2">AI Soil Summary</h4>
                <p className="text-gray-700 mb-4">{aiData.overall_status}</p>
                <h5 className="font-semibold text-gray-800">Recommendations:</h5>
                <ul className="space-y-2 mt-3">
                  {aiData.recommendations.map((r, i) => (
                    <li key={i} className="flex gap-2"><span className="text-green-600 font-bold">✓</span>{r}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={saveResult}
                className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
              >
                Save Result
              </button>
            </div>
          )}
        </div>
      </div>

        {/* Slide-in Drawer */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-white to-green-50 shadow-2xl transform transition-transform z-50 border-l-4 border-green-600 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6 flex justify-between items-center border-b-4 border-green-200 bg-gradient-to-r from-green-600 to-emerald-600">
          <h3 className="font-bold text-xl text-white flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Saved Reports
          </h3>
          <button onClick={() => setDrawerOpen(false)} className="bg-white rounded-full cursor-pointer p-2 hover:bg-green-100 transition-all">
            <X className="text-green-600" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-full pb-32">
          {savedReports.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-500 font-medium">No reports saved yet.</p>
              <p className="text-sm text-gray-400 mt-2">Upload and analyze a soil report to get started!</p>
            </div>
          )}
          {savedReports.map((report) => (
            <div
              key={report.id}
              className="border-2 border-green-200 rounded-xl p-4 mb-4 cursor-pointer hover:bg-green-50 transition-all transform hover:scale-[1.02] hover:shadow-lg bg-white"
              onClick={() => setModalData(report)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  report.soilHealth === "Good" ? "bg-green-100 text-green-700" :
                  report.soilHealth === "Fair" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {report.soilHealth}
                </span>
                <span className="text-xs text-gray-500">{new Date(report.date).toLocaleDateString()}</span>
              </div>
              <p className="font-bold text-gray-800 mb-1">pH: {report.averagePH}</p>
              <p className="text-gray-600 text-sm line-clamp-2">{report.overall_status}</p>
            </div>
          ))}
        </div>
      </div>


       {/* Modal Popup */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-3xl p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-green-300">
            <button
              onClick={() => setModalData(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-green-800 mb-2 flex items-center gap-3">
                <span className="text-4xl">📊</span> Soil Report Details
              </h3>
              <p className="text-gray-500 flex items-center gap-2">
                <span>📅</span> {modalData.date}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200 text-center">
                <p className="text-sm text-gray-600 font-medium mb-1">pH</p>
                <p className="text-2xl font-bold text-green-700">{modalData.extracted_values.pH || "N/A"}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200 text-center">
                <p className="text-sm text-gray-600 font-medium mb-1">EC</p>
                <p className="text-2xl font-bold text-green-700">{modalData.extracted_values.EC || "N/A"}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border-2 border-purple-200 text-center">
                <p className="text-sm text-gray-600 font-medium mb-1">Nitrogen</p>
                <p className="text-2xl font-bold text-purple-700">{modalData.extracted_values.N || "N/A"}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border-2 border-amber-200 text-center">
                <p className="text-sm text-gray-600 font-medium mb-1">Phosphorus</p>
                <p className="text-2xl font-bold text-amber-700">{modalData.extracted_values.P || "N/A"}</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border-2 border-red-200 text-center">
                <p className="text-sm text-gray-600 font-medium mb-1">Potassium</p>
                <p className="text-2xl font-bold text-red-700">{modalData.extracted_values.K || "N/A"}</p>
              </div>
              <div className={`bg-gradient-to-br p-4 rounded-xl border-2 text-center ${
                modalData.soilHealth === "Good" ? "from-green-50 to-green-100 border-green-300" :
                modalData.soilHealth === "Fair" ? "from-yellow-50 to-yellow-100 border-yellow-300" :
                "from-red-50 to-red-100 border-red-300"
              }`}>
                <p className="text-sm text-gray-600 font-medium mb-1">Health</p>
                <p className={`text-2xl font-bold ${
                  modalData.soilHealth === "Good" ? "text-green-700" :
                  modalData.soilHealth === "Fair" ? "text-yellow-700" :
                  "text-red-700"
                }`}>{modalData.soilHealth}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-l-4 border-green-600 mb-6">
              <p className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">📋</span> Overall Status
              </p>
              <p className="text-gray-700 leading-relaxed">{modalData.overall_status}</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border-l-4 border-amber-600">
              <p className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">💡</span> Recommendations
              </p>
              <ul className="space-y-3">
                {modalData.recommendations.map((r, i) => (
                  <li key={i} className="flex gap-3 items-start bg-white p-3 rounded-lg shadow-sm">
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm flex-shrink-0">{i + 1}</span>
                    <span className="text-gray-700">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}