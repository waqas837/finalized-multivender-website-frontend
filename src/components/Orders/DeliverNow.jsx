import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../apiUrl';
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';

const WorkDeliveryForm = () => {
  const { orderid } = useParams();
  // const location = useLocation();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    Desc: '',
    files: [], // Change to array to handle multiple files
  });

  useEffect(() => {
    (async () => {
      let markAsCompleteBySeller = await getCurrentOrderStatus();
      if (markAsCompleteBySeller) {
        navigate(-1)
      }
    })()
  }, [])
  async function getCurrentOrderStatus() {
    try {
      const { data } = await axios.get(`${apiUrl}/user/getCurrentOrderStatus/${orderid}`);
      return data.data.markAsCompleteBySeller
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setFormValues({
      ...formValues,
      files: [...formValues.files, ...files], // Append files to the existing array
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('Desc', formValues.Desc);
    // Append all files to formData
    formValues.files.forEach((file, index) => {
      formData.append(`file${index + 1}`, file);
    });

    try {
      const { data } = await axios.post(`${apiUrl}/user/submitProjectDelivery/${orderid}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Reset form after successful upload
      setFormValues({
        Desc: '',
        files: [],
      });
      if (data.success) {
        navigate(-1)
      }
    } catch (error) {
      console.error('Error uploading:', error);
    }
  };

  return (
    <div className=" min-h-screen">
      <Link className="text-sm text-blue-500 ml-5" to={"/"}>&larr; Home</Link>
      <header className="bg-transparent py-4 text-center underline">
        <h1 className="text-3xl font-bold">Upload Work Delivery</h1>
        <p className="mt-2">Please fill out the form below to submit your work delivery.</p>
      </header>
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl border-2">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Desc">Describe Your delivery:</label>
            <textarea
              placeholder='Describe the delivery in very short..,'
              id="Desc"
              name="Desc"
              rows={6}
              value={formValues.Desc}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="files">Deliverables:</label>
            <input
              type="file"
              id="files"
              accept="/*"
              onChange={handleFileChange}
              multiple // Allow multiple file selection
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-3xl hover:bg-blue-600">Submit Delivery...</button>
        </form>
      </div>

    </div>
  );
};

export default WorkDeliveryForm;
