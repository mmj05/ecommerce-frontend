import { FiMapPin, FiCreditCard, FiCheckSquare } from 'react-icons/fi';

const CheckoutSteps = ({ currentStep }) => {
  // Define the steps
  const steps = [
    { number: 1, title: 'Shipping', icon: <FiMapPin /> },
    { number: 2, title: 'Payment', icon: <FiCreditCard /> },
    { number: 3, title: 'Review', icon: <FiCheckSquare /> },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step) => (
          <div key={step.number} className="flex-1 flex flex-col items-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                currentStep >= step.number
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step.icon}
            </div>
            <div className="mt-2 text-sm font-medium text-center">
              <div
                className={
                  currentStep >= step.number ? 'text-primary' : 'text-gray-500'
                }
              >
                {step.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress lines between steps */}
      <div className="hidden sm:flex items-center mt-4">
        <div
          className={`h-1 flex-1 ${
            currentStep > 1 ? 'bg-primary' : 'bg-gray-200'
          }`}
        ></div>
        <div
          className={`h-1 flex-1 ${
            currentStep > 2 ? 'bg-primary' : 'bg-gray-200'
          }`}
        ></div>
      </div>
    </div>
  );
};

export default CheckoutSteps;