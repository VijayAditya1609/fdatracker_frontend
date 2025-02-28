import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { FaUpload, FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight, FaFileAlt, FaEye, FaDownload, FaTrash, FaTimes, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { checkUserSubscription } from '../utils/subscriptionUtils';
import { authFetch } from '../services/authFetch';
import { api } from '../config/api';
import Form483Card from '../components/form483/Form483Card';
import { auth } from '../services/auth';

// Define interfaces
interface KeyObservation {
  id: number;
  observationTitle: string;
  observationText: string;
}

interface Form483Data {
  id: number;
  pdfId: string;
  documentType: string;
  countryOfTheIssue: string;
  addressOfTheIssue: string;
  issueDate: string;
  createdAt: string;
  facilityName: string;
  productType: string;
  warningLetterId: number;
  investigators: string[];
  severity: string;
  feinumber: string;
  numOfObservations: number;
  systems: string[];
}

interface Form483Response {
  recordsFiltered: number;
  recordsTotal: number;
  data: Form483Data[];
}

const MyForm483: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [form483List, setForm483List] = useState<Form483Data[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check subscription status on component mount
  useEffect(() => {
    const subscriptionStatus = checkUserSubscription();
    setIsSubscribed(subscriptionStatus);
  }, []);

  // Fetch user-specific Form 483s
  const fetchUserForm483s = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        start: '0',
        length: '10',
        draw: '1',
        orderColumn: '0',
        orderDir: 'asc',
        userSpecific: '1',
      });

      const response = await authFetch(`${api.myForm483}?${params.toString()}`);
      console.log(`Fetching data from: ${api.myForm483}?${params.toString()}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch Form 483s: ${response.status} ${response.statusText}. Response: ${errorText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data: Form483Response = await response.json();
        setForm483List(data.data);
      } else {
        const responseText = await response.text();
        console.error('Non-JSON response:', responseText);
        throw new Error('Received non-JSON response');
      }
    } catch (err) {
      setError('Failed to load Form 483s. Please try again later.');
      console.error('Error fetching Form 483s:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Call fetchUserForm483s on component mount
  useEffect(() => {
    fetchUserForm483s();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSubscribed) return;

    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isSubscribed) return;

    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isSubscribed) return;

    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isSubscribed) return;

    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError(null);
      } else {
        // Show error notification
        setError('Only PDF files are accepted');
      }
    }
  };

  const clearFile = () => {
    setFile(null);
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file || !isSubscribed) return;

    setLoading(true);
    setError(null);

    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('file', file);

      // Make the upload request to the servlet endpoint
      const response = await fetch('/form483/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${auth.getToken()}`
        },
        credentials: 'include'
      });

      // Parse the response
      const result = await response.json();

      // Handle the response
      if (result.error) {
        setError(result.error);
        if (result.similar483Id) {
          // File already exists with a similar checksum
          console.log(`Similar Form 483 ID: ${result.similar483Id}`);
        }
      } else if (result.redirectUrl) {
        // Redirect to the form details page
        window.location.href = result.redirectUrl;
      } else if (result.pdfId) {
        // Handle non-Form 483 case
        setError(`The uploaded file is not identified as a Form 483. ID: ${result.pdfId}`);
      }

      // Refresh the list after upload
      fetchUserForm483s();

    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
      clearFile();
    }
  };

  // Render submit button
  const renderSubmitButton = () => {
    if (!file || !isSubscribed) return null;

    return (
      <button
        onClick={handleFileUpload}
        disabled={loading}
        className={`mt-4 px-6 py-2 rounded-md font-medium text-white transition-colors duration-150 ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
          }`}
      >
        {loading ? 'Uploading...' : 'Submit Form 483'}
      </button>
    );
  };

  // Render upload section based on subscription status
  const renderUploadSection = () => {
    if (!isSubscribed) {
      return (
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 mb-8 transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-shrink-0 mr-6 mb-4 md:mb-0">
              <div className="h-20 w-20 bg-gray-700 rounded-full flex items-center justify-center">
                <FaLock className="text-blue-500 text-3xl" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Upload Form 483 (Premium Feature)</h2>
              <p className="text-gray-400 mb-4">This feature is only available to subscribers. Upgrade your account to unlock Form 483 analysis.</p>
              <button
                className="bg-blue-700 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-150"
                onClick={() => window.location.href = '/subscription'}
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 mb-8 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-2">Upload Form 483</h2>
        <p className="text-gray-400 mb-4">Upload your file or drag and drop</p>

        <div
          className={`mt-2 flex justify-center rounded-lg border-2 border-dashed ${dragActive ? 'border-blue-500 bg-gray-700/50' : 'border-gray-600'} px-6 py-10 transition-all duration-200`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <FaUpload className="mx-auto h-12 w-12 text-gray-500" />
            <div className="mt-4 flex flex-col text-sm text-gray-400 justify-center items-center">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-blue-600 px-4 py-2 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:bg-blue-500 transition-all duration-150"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                  ref={fileInputRef}
                />
              </label>
              <p className="pl-1 pt-2">or drag and drop below</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">PDF files only, up to 10MB</p>

            {loading ? (
              <div className="mt-6 w-full bg-gray-750 rounded-lg shadow-md p-4 flex items-center justify-center">
                <p className="text-white">Processing file...</p>
              </div>
            ) : (
              file && (
                <motion.div
                  className="mt-6 w-full bg-gray-700 rounded-lg shadow-md p-4 transition-all duration-300 flex items-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 bg-gray-600 rounded-md flex items-center justify-center">
                      <FaFileAlt className="text-white text-2xl" />
                    </div>
                  </div>
                  <div className="ml-4 flex-grow">
                    <p className="font-medium truncate max-w-full text-white">{file.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB · PDF</p>
                  </div>
                  <button
                    onClick={clearFile}
                    className="text-red-500 hover:text-red-400 transition duration-150 ease-in-out flex items-center ml-4"
                    title="Remove file"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </motion.div>
              )
            )}

            {renderSubmitButton()}

            {error && (
              <div className="mt-4 p-3 bg-red-900/50 border border-red-800 rounded-md text-red-300">
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-900 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <a href="/dashboard" className="text-blue-500 hover:text-blue-400 flex items-center mb-2 transition duration-150">
            <FaChevronLeft className="mr-1" /> Back to Dashboard
          </a>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">My Form 483s</h1>
              <p className="text-gray-400">Analyze your Form 483 in depth with detailed sub-system analysis & observations reports</p>
            </div>
          </div>
        </div>

        {/* Upload Section - Rendered conditionally based on subscription */}
        {renderUploadSection()}

        {/* Data Table Section */}
        <h2 className="text-2xl font-bold text-white">Previously Uploaded Form 483s</h2>
        <p className="text-gray-400 mb-4">View your previously uploaded Form 483s</p>
        <div>
          {/* Render loading state or error message */}
          {isLoading && <p className="text-gray-400">Loading Form 483s...</p>}
          {error && <p className="text-red-400">{error}</p>}

          <div className="mt-4 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            {form483List.length > 0 ? (
              form483List.map((item) => (
                <Form483Card
                  key={item.id}
                  form483={{
                    id: item.id,
                    facilityName: item.facilityName,
                    companyName: item.productType,
                    location: item.countryOfTheIssue,
                    issueDate: item.issueDate,
                    numOfObservations: item.numOfObservations,
                    status: item.severity === 'Complete',
                    systems: item.systems,
                  }}
                  onClick={() => window.open(`/form-483s/${item.pdfId}`, '_blank')}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-700 mt-4 w-full">
                <FaFileAlt className="text-gray-500 text-5xl mb-4" />
                <p className="text-xl font-semibold text-white">No Form 483s Found</p>
                <p className="text-md text-gray-400 mt-2 mb-4">Please upload your first Form 483 to get started.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyForm483;