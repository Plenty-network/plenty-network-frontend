import Lottie from "lottie-react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

import { PopUpModal } from "../Modal/popupModal";
import clsx from "clsx";

interface ITutorialProps {
  show: boolean;
  setShow: any;
}

function Tutorial(props: ITutorialProps) {
  const STEPS: {
    displayText: string;
    mobileDisplayText: string;
  }[] = [
    {
      displayText:
        "In classic pools, liquidity was distributed in the full range of possible prices. With supercharged pools, we can now concentrate liquidity around the current spot price, massively increasing capital efficienc",
      mobileDisplayText:
        "In classic pools, liquidity was distributed in the full range of possible prices. With supercharged pools, we can now concentrate liquidity around the current spot price, massively increasing capital efficienc",
    },
    {
      displayText:
        "Now you can pick a strategy that suits you. Passive strategies allows you to distribute a little bit across the entire span. You earn less, but never go out of range.",
      mobileDisplayText:
        "Now you can pick a strategy that suits you. Passive strategies allows you to distribute a little bit across the entire span. You earn less, but never go out of range.",
    },
    {
      displayText:
        "A more aggressive strategy will allow you to earn more, but is more likely to go out of range. Watch it closely and rebalance as needed. While out of range, you will stop earning on swaps.",
      mobileDisplayText:
        "A more aggressive strategy will allow you to earn more, but is more likely to go out of range. Watch it closely and rebalance as needed. While out of range, you will stop earning on swaps.",
    },
    {
      displayText:
        "Like a traditional AMM, as prices move, assets are converted entirely into one of the assets in the pool. If your position goes out of range, then you'll have 100% of the other asset until the price re-enters your range.",
      mobileDisplayText:
        "Like a traditional AMM, as prices move, assets are converted entirely into one of the assets in the pool. If your position goes out of range, then you'll have 100% of the other asset until the price re-enters your range.",
    },
    {
      displayText:
        "In the free market of LPs everyone follows different strategies. Liquidity is more dynamic, and better optimized for traders..",
      mobileDisplayText:
        "In the free market of LPs everyone follows different strategies. Liquidity is more dynamic, and better optimized for traders.",
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  console.log("Current Step:", currentStep);

  const closeModal = () => {
    props.setShow(false);
  };

  // Function to navigate to the previous step
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      document.querySelectorAll(".loading-bar").forEach((bar) => bar.classList.remove("active"));

      setCurrentStep(currentStep - 1);
    }
  };

  // Function to navigate to the next step
  const goToNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      console.log("inc", currentStep, STEPS.length - 1);
      setCurrentStep(currentStep + 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prevStep) => {
        if (prevStep < STEPS.length - 1) {
          return prevStep + 1;
        } else {
          clearInterval(interval);
          return prevStep;
        }
      });
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return props.show ? (
    <PopUpModal
      className="md:w-[800px] md:max-w-[800px]"
      noGlassEffect={true}
      isAnimteToLoader={true}
      onhide={closeModal}
    >
      <>
        <div className="flex justify-center font-title1">What is Supercharged Liquidity?</div>

        <div className="flex gap-4 mt-[50px] justify-center">
          {STEPS.map((step, index) => (
            <div className="loading-container" key={index}>
              <div
                className={`loading-bar ${index < currentStep ? "bg-primary-500 w-auto" : ""} ${
                  currentStep === index ? "active" : ""
                }`}
              ></div>
            </div>
          ))}
        </div>

        <div
          className={clsx(
            "flex justify-center mt-[50px] text-center mx-8 ",

            currentStep && "fade-in-3"
          )}
        >
          {STEPS[currentStep].displayText}
        </div>

        <div className="flex justify-between mt-10 mx-5">
          <button
            onClick={goToPreviousStep}
            className={clsx("text-sm", {
              "opacity-50 cursor-not-allowed": currentStep === 0,
            })}
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <button
            onClick={goToNextStep}
            className={clsx("text-sm", {
              "opacity-50 cursor-not-allowed": currentStep === STEPS.length - 1,
            })}
            disabled={currentStep === STEPS.length - 1}
          >
            Next
          </button>
        </div>
      </>
    </PopUpModal>
  ) : null;
}

export default Tutorial;
