"use client";

import React, { useState } from 'react';
import Step1 from './step/step1';
import Step2 from './step/Step2';
import Step3 from './step/Step3';
import Step4 from './step/Step4';

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(1);
  // Dữ liệu dùng chung cho cả 4 bước
  const [formData, setFormData] = useState({ 
    email: '', 
    otp: '', 
    newPassword: '' 
  });

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  // Hàm cập nhật dữ liệu từng phần mà không làm mất dữ liệu các bước trước
  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md border border-slate-100">
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-10 px-4">
          {[1, 2, 3, 4].map((step) => (
            <React.Fragment key={step}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                ${currentStep >= step ? 'bg-[#00477a] text-white' : 'bg-slate-100 text-slate-400'}`}>
                {step}
              </div>
              {step < 4 && <div className="flex-1 h-[1px] bg-slate-200 mx-2"></div>}
            </React.Fragment>
          ))}
        </div>

        {/* Nội dung thay đổi theo step */}
        {currentStep === 1 && (
          <Step1 nextStep={nextStep} setFormData={updateFormData} />
        )}
        {currentStep === 2 && (
          <Step2 nextStep={nextStep} prevStep={prevStep} setFormData={updateFormData} email={formData.email} />
        )}
        {currentStep === 3 && (
          <Step3 nextStep={nextStep} prevStep={prevStep} setFormData={updateFormData} email={formData.email}/>
        )}
        {currentStep === 4 && (
          <Step4 />
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;