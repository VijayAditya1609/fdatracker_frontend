import React from 'react';
import Modal from 'react-modal';

interface InspectionModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: () => Promise<void>; // Change to Promise<void> since it's async
  isSubmitting?: boolean;
  title?: string;
  content?: string;
}

const InspectionModal: React.FC<InspectionModalProps> = ({ 
  isOpen, 
  onRequestClose, 
  onSubmit, 
  isSubmitting,
  title = "Form 483 Availability",
  content = "Thank you for your request. Our team will review and confirm the availability of Form 483 shortly."
}) => {
  const handleSubmit = async () => {
    await onSubmit();
    onRequestClose(); // Call onRequestClose after submission
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-gray-800 p-6 rounded-lg text-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
      shouldCloseOnOverlayClick={!isSubmitting}
      shouldCloseOnEsc={!isSubmitting}
    >
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <p className="text-gray-300 mb-4">{content}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onRequestClose}
          className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </Modal>
  );
};

export default InspectionModal;