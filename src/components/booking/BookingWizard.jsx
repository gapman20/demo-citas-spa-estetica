import { useState } from 'react';
import { useBooking } from './BookingContext';
import StepProgress from './StepProgress';
import StepService from './StepService';
import StepStaff from './StepStaff';
import StepDateTime from './StepDateTime';
import StepContact from './StepContact';
import StepConfirm from './StepConfirm';
import styles from './BookingWizard.module.css';

const STEPS = [StepService, StepStaff, StepDateTime, StepContact, StepConfirm];

function canAdvance(step, state) {
  switch (step) {
    case 1:
      return state.serviceId !== null;
    case 2:
      return state.staffId !== null;
    case 3:
      return state.date !== null && state.timeSlot !== null;
    case 4:
      return true; // StepContact handles its own validation
    default:
      return true;
  }
}

export default function BookingWizard({ initialStep = 1 }) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const state = useBooking();

  const StepComponent = STEPS[currentStep - 1];
  const canGoNext = canAdvance(currentStep, state);
  const isFirstStep = currentStep === 1;

  const stepTitles = [
    null,
    'Elegí un Servicio',
    'Elegí un Profesional',
    'Elegí Fecha y Horario',
    'Tus Datos',
    'Confirmar Cita',
  ];

  function handleNext() {
    if (currentStep >= 5) return;

    // Si el profesional ya está pre-seleccionado (via ?staff=) al elegir servicio,
    // salteamos el paso 2 y vamos directo a elegir fecha/hora
    if (currentStep === 1 && state.staffId) {
      setCurrentStep(3);
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  }

  function goToStep(step) {
    setCurrentStep(step);
  }

  return (
    <div className={styles.wizard}>
      <StepProgress currentStep={currentStep} />

      <div className={styles.stepContainer}>
        <h2 className={styles.stepTitle}>{stepTitles[currentStep]}</h2>

        <div className={styles.stepContent}>
          {currentStep === 1 ? (
            <StepService onNext={handleNext} />
          ) : currentStep === 2 ? (
            <StepStaff onNext={handleNext} />
          ) : currentStep === 4 ? (
            <StepContact onNext={handleNext} onBack={handleBack} />
          ) : currentStep === 5 ? (
            <StepConfirm onReset={() => goToStep(1)} />
          ) : (
            <StepComponent />
          )}
        </div>

        {currentStep <= 3 && (
          <div className={styles.nav}>
            {!isFirstStep && (
              <button
                type="button"
                className={styles.backBtn}
                onClick={handleBack}
              >
                ← Atrás
              </button>
            )}
            <button
              type="button"
              className={styles.nextBtn}
              onClick={handleNext}
              disabled={!canGoNext}
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
