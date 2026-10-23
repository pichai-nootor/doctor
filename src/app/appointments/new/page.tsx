"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppointments } from "@/context/AppointmentContext";
import { useMedications } from "@/context/MedicationContext";
import { useDosages } from "@/context/DosageContext";
import { Appointment } from "@/types/appointment";
import { Dosage } from "@/types/dosage";
import Link from "next/link";
import ThaiDatePicker from "@/components/ThaiDatePicker";
import MedicationCombobox from "@/components/MedicationCombobox";

export default function NewAppointment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const copyId = searchParams.get("copyId");
  const { addAppointment, appointments } = useAppointments();
  const { medications } = useMedications();
  const { dosages } = useDosages();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const procedures = [
    "All",
    "CAG",
    "PCI",
    "CAG+/-PCI",
    "PPM",
    "EPS",
    "EPS+/-RFA",
    "Other",
  ];
  const [formData, setFormData] = useState<Partial<Appointment>>({
    procedure: "CAG+/-PCI",
    currentMedications: [],
    withheldMedications: [],
    preCathOrders: [
      "Lab : CBC, BUN, Cr, E'lyte, Trop-T, Anti-HIV, Anti HbsAB, HCV, HbsAG (Anti hepatitisทุกตัว)",
      "NPO 6 hr",
      "EKG , CXR P",
      "On 0.9% NSS 1000 ml IV KVO",
    ],
    requiredDocuments: [
      "NSO-034 ใบแสดงความยินยอมผ่าตัด **ทิ้งหน้าที่ 3 ไป**",
      "NSO-005 หนังสือแสดงความยินยอมตรวจ HIV",
      "CCL-011-01 ใบยินยอมการฉีดสีและทำบอลลูนขยายหลอดเลือด",
      "CCL-012 Pre Cardiac Catheterization order",
      "ชุด Admit ปกติ",
    ],
    underlyingDisease: "(ฝากซักประวัติเพิ่ม)",
    history: "เหนื่อย แน่นหน้าอก (ฝากซักประวัติเพิ่ม)",
  });

  useEffect(() => {
    if (copyId && appointments.length > 0) {
      const sourceApt = appointments.find((a) => a.id === copyId);
      if (sourceApt) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, postCathStatus, postCathData, ...copiedData } = sourceApt;
        setFormData((prev) => ({
          ...prev,
          ...copiedData,
        }));
      }
    }
  }, [copyId, appointments]);

  const [tempMed, setTempMed] = useState({ name: "", dosage: "" });
  const [tempWithheld, setTempWithheld] = useState({ name: "", date: "" });
  const [tempOrder, setTempOrder] = useState("");
  const [tempDoc, setTempDoc] = useState("");

  // Inline editing states
  const [editingMed, setEditingMed] = useState<{
    index: number;
    name: string;
    dosage: string;
  } | null>(null);
  const [editingWithheld, setEditingWithheld] = useState<{
    index: number;
    name: string;
    date: string;
  } | null>(null);
  const [editingOrder, setEditingOrder] = useState<{
    index: number;
    value: string;
  } | null>(null);
  const [editingDoc, setEditingDoc] = useState<{
    index: number;
    value: string;
  } | null>(null);

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < totalSteps) {
      nextStep();
      return;
    }

    // Sanitize formData to remove undefined values for Firebase
    const sanitizedData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== undefined),
    );

    const newAppointment: Appointment = {
      ...sanitizedData,
      id: Date.now().toString(),
    } as unknown as Appointment;

    addAppointment(newAppointment);
    router.push("/appointments");
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="container mx-auto px-6 py-10 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-4 mb-6">
        <Link
          href="/appointments"
          className="group flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-slate-500 group-hover:text-slate-800 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`text-xs font-bold ${currentStep >= step ? "text-emerald-600" : "text-slate-400"}`}
            >
              Step {step}:{" "}
              {step === 1 ? "Clinical" : step === 2 ? "Patient" : "Orders"}
            </div>
          ))}
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div
            className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative min-h-[400px]"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2" />

        <div className="p-5 sm:p-8 md:p-10">
          {/* Section 1: Clinical Info */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
                <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg shadow-inner">
                  1
                </span>
                <span>Clinical Information</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Row 1: Procedure (2 cols) + Case No. (1 col) */}
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Procedure
                  </label>
                  <div className="relative">
                    <select
                      name="procedure"
                      className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-700"
                      onChange={handleInputChange}
                      value={formData.procedure}
                    >
                      <option value="CAG+/-PCI">CAG+/-PCI</option>
                      <option value="CAG">CAG</option>
                      <option value="PCI">Stage PCI</option>
                      <option value="PPM">PPM</option>
                      <option value="EPS">EPS</option>
                      <option value="EPS+/-RFA">EPS+/-RFA</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">
                    Case No.
                  </label>
                  <input
                    required
                    type="text"
                    name="caseNo"
                    value={formData.caseNo || ""}
                    placeholder="e.g. 3"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-700 placeholder:text-slate-500"
                    onChange={handleInputChange}
                  />
                </div>

                {/* Row 2: Date / Time ER / Time Set */}
                <div className="space-y-1 relative">
                  <label className="block text-sm font-semibold text-slate-700">
                    Date
                  </label>
                  <ThaiDatePicker
                    value={formData.date || ""}
                    onChange={(_, dateString) =>
                      setFormData((prev) => ({ ...prev, date: dateString }))
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-700"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">
                    Time ER
                  </label>
                  <input
                    required
                    type="text"
                    name="timeER"
                    value={formData.timeER || ""}
                    placeholder="e.g. 23:00"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">
                    Time Set
                  </label>
                  <input
                    required
                    type="text"
                    name="timeSet"
                    value={formData.timeSet || ""}
                    placeholder="e.g. on call"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-700 placeholder:text-slate-500"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Patient Info */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
                <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg shadow-inner">
                  2
                </span>
                <span>Patient Demographics</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">
                    Patient Name
                  </label>
                  <input
                    required
                    type="text"
                    name="patientName"
                    value={formData.patientName || ""}
                    placeholder="Full name"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-500"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">
                    Assigned Doctor
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                      Dr.
                    </div>
                    <select
                      required
                      name="doctor"
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                      onChange={handleInputChange}
                      value={formData.doctor || ""}
                    >
                      <option value="" disabled>
                        Select Doctor
                      </option>
                      <option value="ปริชาพล">ปริชาพล</option>
                      <option value="ทรงภพ">ทรงภพ</option>
                      <option value="พลกฤษณ์">พลกฤษณ์</option>
                      <option value="ชวัล">ชวัล</option>
                      <option value="พัฒวรินทร์">พัฒวรินทร์</option>
                      <option value="สุรเชษฐ์">สุรเชษฐ์</option>
                      <option value="ปิยวัฒน์">ปิยวัฒน์</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">
                    Contact Number
                  </label>
                  <input
                    required
                    type="text"
                    name="patientTel"
                    value={formData.patientTel || ""}
                    placeholder="Phone or mobile"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-500"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">
                    Underlying Disease (U/D)
                  </label>
                  <input
                    type="text"
                    name="underlyingDisease"
                    value={formData.underlyingDisease || ""}
                    placeholder="Any known conditions"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-500"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">
                    History (Hx.)
                  </label>
                  <textarea
                    name="history"
                    rows={3}
                    value={formData.history || ""}
                    placeholder="Patient's medical history..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-500 resize-none"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Arrays & Notes */}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-3">
                <span className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg shadow-inner">
                  3
                </span>
                <span>Orders & Medications</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700">
                      Current Medications
                    </label>
                    <div className="flex flex-col lg:flex-row gap-2">
                      <MedicationCombobox
                        value={tempMed.name}
                        onChange={(v) => setTempMed({ ...tempMed, name: v })}
                        placeholder="ชื่อยา (e.g. ASA)"
                        suggestions={medications.map((m) => m.name)}
                        inputClassName="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 placeholder:text-slate-500"
                      />
                      <MedicationCombobox
                        value={tempMed.dosage}
                        onChange={(v) => setTempMed({ ...tempMed, dosage: v })}
                        placeholder="Dosage (e.g. 1*1 pc.)"
                        suggestions={dosages.map((d: Dosage) => d.name)}
                        inputClassName="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 placeholder:text-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (tempMed.name) {
                            setFormData({
                              ...formData,
                              currentMedications: [
                                ...(formData.currentMedications || []),
                                tempMed,
                              ],
                            });
                            setTempMed({ name: "", dosage: "" });
                          }
                        }}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 font-medium text-sm transition-colors whitespace-nowrap"
                      >
                        Add
                      </button>
                    </div>
                    {formData.currentMedications &&
                      formData.currentMedications.length > 0 && (
                        <ul className="space-y-2 mt-2">
                          {formData.currentMedications.map((m, i) => (
                            <li
                              key={i}
                              className="flex justify-between items-center p-2.5 bg-white border border-slate-100 rounded-lg shadow-sm text-sm"
                            >
                              {editingMed?.index === i ? (
                                <div className="flex gap-2 flex-1 mr-2">
                                  <input
                                    type="text"
                                    className="flex-1 px-2 py-1 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                    value={editingMed.name}
                                    onChange={(e) =>
                                      setEditingMed({
                                        ...editingMed,
                                        name: e.target.value,
                                      })
                                    }
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "Enter" ||
                                        e.key === "Escape"
                                      ) {
                                        const meds = [
                                          ...(formData.currentMedications ||
                                            []),
                                        ];
                                        meds[i] = {
                                          name: editingMed.name,
                                          dosage: editingMed.dosage,
                                        };
                                        setFormData({
                                          ...formData,
                                          currentMedications: meds,
                                        });
                                        setEditingMed(null);
                                      }
                                    }}
                                  />
                                  <input
                                    type="text"
                                    className="w-28 px-2 py-1 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                    value={editingMed.dosage}
                                    onChange={(e) =>
                                      setEditingMed({
                                        ...editingMed,
                                        dosage: e.target.value,
                                      })
                                    }
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "Enter" ||
                                        e.key === "Escape"
                                      ) {
                                        const meds = [
                                          ...(formData.currentMedications ||
                                            []),
                                        ];
                                        meds[i] = {
                                          name: editingMed.name,
                                          dosage: editingMed.dosage,
                                        };
                                        setFormData({
                                          ...formData,
                                          currentMedications: meds,
                                        });
                                        setEditingMed(null);
                                      }
                                    }}
                                    onBlur={() => {
                                      const meds = [
                                        ...(formData.currentMedications || []),
                                      ];
                                      meds[i] = {
                                        name: editingMed.name,
                                        dosage: editingMed.dosage,
                                      };
                                      setFormData({
                                        ...formData,
                                        currentMedications: meds,
                                      });
                                      setEditingMed(null);
                                    }}
                                  />
                                </div>
                              ) : (
                                <div
                                  className="cursor-pointer flex-1"
                                  onClick={() =>
                                    setEditingMed({
                                      index: i,
                                      name: m.name,
                                      dosage: m.dosage,
                                    })
                                  }
                                >
                                  <span className="font-medium text-slate-700">
                                    {m.name}
                                  </span>{" "}
                                  <span className="text-slate-500">
                                    {m.dosage}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingMed({
                                      index: i,
                                      name: m.name,
                                      dosage: m.dosage,
                                    })
                                  }
                                  className="text-slate-400 hover:text-purple-500 p-1 transition-colors"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFormData({
                                      ...formData,
                                      currentMedications:
                                        formData.currentMedications?.filter(
                                          (_, idx) => idx !== i,
                                        ),
                                    })
                                  }
                                  className="text-red-400 hover:text-red-600 p-1"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-red-600">
                      Withheld Medications
                    </label>
                    <div className="flex flex-col lg:flex-row gap-2">
                      <MedicationCombobox
                        value={tempWithheld.name}
                        onChange={(v) =>
                          setTempWithheld({ ...tempWithheld, name: v })
                        }
                        placeholder="ชื่อยา (e.g. Forxiga)"
                        suggestions={medications.map((m) => m.name)}
                        inputClassName="px-3 py-2 bg-red-50/30 border border-red-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 placeholder:text-red-400"
                      />
                      <div className="w-full lg:w-1/3">
                        <ThaiDatePicker
                          placeholderText="Select Date"
                          value={tempWithheld.date}
                          onChange={(_, dateString) =>
                            setTempWithheld({
                              ...tempWithheld,
                              date: dateString,
                            })
                          }
                          className="w-full px-3 py-2 bg-red-50/30 border border-red-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 placeholder:text-red-400"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (tempWithheld.name) {
                            setFormData({
                              ...formData,
                              withheldMedications: [
                                ...(formData.withheldMedications || []),
                                tempWithheld,
                              ],
                            });
                            setTempWithheld({ name: "", date: "" });
                          }
                        }}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium text-sm transition-colors whitespace-nowrap"
                      >
                        Add
                      </button>
                    </div>
                    {formData.withheldMedications &&
                      formData.withheldMedications.length > 0 && (
                        <ul className="space-y-2 mt-2">
                          {formData.withheldMedications.map((m, i) => (
                            <li
                              key={i}
                              className="flex justify-between items-center p-2.5 bg-red-50/50 border border-red-100 rounded-lg text-sm"
                            >
                              {editingWithheld?.index === i ? (
                                <div className="flex gap-2 flex-1 mr-2">
                                  <input
                                    list="medication-suggestions"
                                    autoFocus
                                    type="text"
                                    className="flex-1 px-2 py-1 border border-red-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20"
                                    value={editingWithheld.name}
                                    onChange={(e) =>
                                      setEditingWithheld({
                                        ...editingWithheld,
                                        name: e.target.value,
                                      })
                                    }
                                    onBlur={() => {
                                      const ws = [
                                        ...(formData.withheldMedications || []),
                                      ];
                                      ws[i] = {
                                        name: editingWithheld.name,
                                        date: editingWithheld.date,
                                      };
                                      setFormData({
                                        ...formData,
                                        withheldMedications: ws,
                                      });
                                      setEditingWithheld(null);
                                    }}
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "Enter" ||
                                        e.key === "Escape"
                                      ) {
                                        const ws = [
                                          ...(formData.withheldMedications ||
                                            []),
                                        ];
                                        ws[i] = {
                                          name: editingWithheld.name,
                                          date: editingWithheld.date,
                                        };
                                        setFormData({
                                          ...formData,
                                          withheldMedications: ws,
                                        });
                                        setEditingWithheld(null);
                                      }
                                    }}
                                  />
                                  <input
                                    type="text"
                                    className="w-28 px-2 py-1 border border-red-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20"
                                    value={editingWithheld.date}
                                    onChange={(e) =>
                                      setEditingWithheld({
                                        ...editingWithheld,
                                        date: e.target.value,
                                      })
                                    }
                                    onBlur={() => {
                                      const ws = [
                                        ...(formData.withheldMedications || []),
                                      ];
                                      ws[i] = {
                                        name: editingWithheld.name,
                                        date: editingWithheld.date,
                                      };
                                      setFormData({
                                        ...formData,
                                        withheldMedications: ws,
                                      });
                                      setEditingWithheld(null);
                                    }}
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "Enter" ||
                                        e.key === "Escape"
                                      ) {
                                        const ws = [
                                          ...(formData.withheldMedications ||
                                            []),
                                        ];
                                        ws[i] = {
                                          name: editingWithheld.name,
                                          date: editingWithheld.date,
                                        };
                                        setFormData({
                                          ...formData,
                                          withheldMedications: ws,
                                        });
                                        setEditingWithheld(null);
                                      }
                                    }}
                                  />
                                </div>
                              ) : (
                                <div
                                  className="cursor-pointer flex-1"
                                  onClick={() =>
                                    setEditingWithheld({
                                      index: i,
                                      name: m.name,
                                      date: m.date,
                                    })
                                  }
                                >
                                  <span className="font-bold text-red-700">
                                    {m.name}
                                  </span>{" "}
                                  <span className="text-red-500/70 text-xs">
                                    - {m.date}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingWithheld({
                                      index: i,
                                      name: m.name,
                                      date: m.date,
                                    })
                                  }
                                  className="text-red-300 hover:text-red-500 p-1 transition-colors"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFormData({
                                      ...formData,
                                      withheldMedications:
                                        formData.withheldMedications?.filter(
                                          (_, idx) => idx !== i,
                                        ),
                                    })
                                  }
                                  className="text-red-400 hover:text-red-600 p-1"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700">
                      Pre-Cath Orders
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Order details (e.g. NPO 6 hr)"
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 placeholder:text-slate-500"
                        value={tempOrder}
                        onChange={(e) => setTempOrder(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (tempOrder) {
                              setFormData({
                                ...formData,
                                preCathOrders: [
                                  ...(formData.preCathOrders || []),
                                  tempOrder,
                                ],
                              });
                              setTempOrder("");
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (tempOrder) {
                            setFormData({
                              ...formData,
                              preCathOrders: [
                                ...(formData.preCathOrders || []),
                                tempOrder,
                              ],
                            });
                            setTempOrder("");
                          }
                        }}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 font-medium text-sm transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {formData.preCathOrders &&
                      formData.preCathOrders.length > 0 && (
                        <ul className="space-y-2 mt-2">
                          {formData.preCathOrders.map((o, i) => (
                            <li
                              key={i}
                              className="flex justify-between items-start p-2.5 bg-white border border-slate-100 rounded-lg shadow-sm text-sm"
                            >
                              {editingOrder?.index === i ? (
                                <input
                                  autoFocus
                                  type="text"
                                  className="flex-1 mr-2 px-2 py-1 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500/20"
                                  value={editingOrder.value}
                                  onChange={(e) =>
                                    setEditingOrder({
                                      ...editingOrder,
                                      value: e.target.value,
                                    })
                                  }
                                  onBlur={() => {
                                    const ords = [
                                      ...(formData.preCathOrders || []),
                                    ];
                                    ords[i] = editingOrder.value;
                                    setFormData({
                                      ...formData,
                                      preCathOrders: ords,
                                    });
                                    setEditingOrder(null);
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" ||
                                      e.key === "Escape"
                                    ) {
                                      const ords = [
                                        ...(formData.preCathOrders || []),
                                      ];
                                      ords[i] = editingOrder.value;
                                      setFormData({
                                        ...formData,
                                        preCathOrders: ords,
                                      });
                                      setEditingOrder(null);
                                    }
                                  }}
                                />
                              ) : (
                                <span
                                  className="text-slate-700 font-medium flex-1 cursor-pointer"
                                  onClick={() =>
                                    setEditingOrder({ index: i, value: o })
                                  }
                                  dangerouslySetInnerHTML={{
                                    __html: o.replace(
                                      /\*\*(.*?)\*\*/g,
                                      (match, p1) =>
                                        p1.includes("ทิ้งหน้าที่ 3 ไป")
                                          ? `<span class="font-bold">**${p1}**</span>`
                                          : `<span class="font-bold text-red-600">**${p1}**</span>`,
                                    ),
                                  }}
                                ></span>
                              )}
                              <div className="flex items-center gap-1 shrink-0 ml-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingOrder({ index: i, value: o })
                                  }
                                  className="text-slate-400 hover:text-purple-500 p-1 transition-colors"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFormData({
                                      ...formData,
                                      preCathOrders:
                                        formData.preCathOrders?.filter(
                                          (_, idx) => idx !== i,
                                        ),
                                    })
                                  }
                                  className="text-red-400 hover:text-red-600 p-1"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700">
                      Required Documents
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Document name (use **text** for bold)"
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 placeholder:text-slate-500"
                        value={tempDoc}
                        onChange={(e) => setTempDoc(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (tempDoc) {
                              setFormData({
                                ...formData,
                                requiredDocuments: [
                                  ...(formData.requiredDocuments || []),
                                  tempDoc,
                                ],
                              });
                              setTempDoc("");
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (tempDoc) {
                            setFormData({
                              ...formData,
                              requiredDocuments: [
                                ...(formData.requiredDocuments || []),
                                tempDoc,
                              ],
                            });
                            setTempDoc("");
                          }
                        }}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 font-medium text-sm transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {formData.requiredDocuments &&
                      formData.requiredDocuments.length > 0 && (
                        <ul className="space-y-2 mt-2">
                          {formData.requiredDocuments.map((d, i) => (
                            <li
                              key={i}
                              className="flex justify-between items-start p-2.5 bg-white border border-slate-100 rounded-lg shadow-sm text-sm"
                            >
                              {editingDoc?.index === i ? (
                                <input
                                  autoFocus
                                  type="text"
                                  className="flex-1 mr-2 px-2 py-1 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500/20"
                                  value={editingDoc.value}
                                  onChange={(e) =>
                                    setEditingDoc({
                                      ...editingDoc,
                                      value: e.target.value,
                                    })
                                  }
                                  onBlur={() => {
                                    const docs = [
                                      ...(formData.requiredDocuments || []),
                                    ];
                                    docs[i] = editingDoc.value;
                                    setFormData({
                                      ...formData,
                                      requiredDocuments: docs,
                                    });
                                    setEditingDoc(null);
                                  }}
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" ||
                                      e.key === "Escape"
                                    ) {
                                      const docs = [
                                        ...(formData.requiredDocuments || []),
                                      ];
                                      docs[i] = editingDoc.value;
                                      setFormData({
                                        ...formData,
                                        requiredDocuments: docs,
                                      });
                                      setEditingDoc(null);
                                    }
                                  }}
                                />
                              ) : (
                                <span
                                  className="text-slate-700 font-medium flex-1 cursor-pointer"
                                  onClick={() =>
                                    setEditingDoc({ index: i, value: d })
                                  }
                                  dangerouslySetInnerHTML={{
                                    __html: d.replace(
                                      /\*\*(.*?)\*\*/g,
                                      (match, p1) =>
                                        p1.includes("ทิ้งหน้าที่ 3 ไป")
                                          ? `<span class="font-bold">**${p1}**</span>`
                                          : `<span class="font-bold text-red-600">**${p1}**</span>`,
                                    ),
                                  }}
                                ></span>
                              )}
                              <div className="flex items-center gap-1 shrink-0 ml-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingDoc({ index: i, value: d })
                                  }
                                  className="text-slate-400 hover:text-purple-500 p-1 transition-colors"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFormData({
                                      ...formData,
                                      requiredDocuments:
                                        formData.requiredDocuments?.filter(
                                          (_, idx) => idx !== i,
                                        ),
                                    })
                                  }
                                  className="text-red-400 hover:text-red-600 p-1"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex justify-center sm:justify-start">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="w-full sm:w-auto justify-center px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 shadow-sm hover:shadow hover:bg-slate-50 transition-all flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-stretch sm:justify-end">
            <Link
              href="/appointments"
              className="w-full sm:w-auto justify-center px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:text-slate-900 bg-transparent hover:bg-slate-100 transition-all items-center flex"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="w-full sm:w-auto justify-center px-8 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-500/20 transition-all transform active:scale-95 flex items-center group cursor-pointer"
            >
              {currentStep === totalSteps ? "Confirm Booking" : "Next Step"}
              {currentStep !== totalSteps && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
