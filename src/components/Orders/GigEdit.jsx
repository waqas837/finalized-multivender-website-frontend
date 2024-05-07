import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../../apiUrl';

const GigEdit = () => {
    const { gigId } = useParams();
    const [gigDetails, setGigDetails] = useState([]);
    const [categories, setCategories] = useState([]);
    const [inputs, setInputs] = useState({
        title: "",
        description: "",
        category: "",
        productImg: "",
    });
    const [file, setFile] = useState(null);
    const navigate = useNavigate()
    useEffect(() => {
        getSingleGigDetails();
    }, []);
    const getSingleGigDetails = async () => {
        try {
            let { data } = await axios.get(`${apiUrl}/user/getSingleProduct/${gigId}`);
            setGigDetails(data.data);

            console.log("Products must be ", data);
        } catch (error) {
            console.log("Err in function getSingleGigDetails", error);
        }
    };
    useEffect(() => {
        getAllCategories();
    }, []);
    // getAllCategories
    const getAllCategories = async () => {
        try {
            let { data } = await axios.get(`${apiUrl}/user/getAllCategories`)
            if (data.success) {
                setCategories(data.categories)
            }
        } catch (error) {
            console.log("Error", error)
        }

    }
    // update gig
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData();
            formData.append("title", inputs.title || gigDetails.title); // Use default if empty
            formData.append("description", inputs.description || gigDetails.description); // Use default if empty
            formData.append("category", inputs.category || gigDetails.category); // Use default if empty
            formData.append("file", file || gigDetails.productImg); // Use default if empty
            formData.append("price", inputs.price || gigDetails.price);
            let { data } = await axios.patch(`${apiUrl}/user/updateGig/${gigId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (data.success) {
                navigate(-1)
            }
            console.log("Products must be ", data);
        } catch (error) {
            console.log("Err in function getSingleGigDetails", error);
        }
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputs({ ...inputs, [name]: value });
    };
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };


    return (
        <>
            <Link className="text-sm text-blue-500 ml-5" to={"/"}>&larr; Home</Link>
            <h1 className='my-10 text-xl font-bold text-center text-gray-500'>Edit Your Product</h1>
            <div className="flex items-center justify-center w-full">
                <div className="mx-auto w-full max-w-[550px] bg-white">
                    <form className="py-4 px-9" onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label
                                for="email"
                                className="mb-3 block text-base font-medium text-[#07074D]"
                            >
                                Attractive Title:
                            </label>
                            <input
                                onChange={handleInputChange}
                                name="title"
                                placeholder=""
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                defaultValue={gigDetails && gigDetails.title}
                                required />
                        </div>

                        <div className="mb-5">
                            <label
                                for="email"
                                className="mb-3 block text-base font-medium text-[#07074D]"
                            >
                                Description
                            </label>
                            <textarea
                                required
                                onChange={handleInputChange}
                                name="description"
                                placeholder="Best description"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                defaultValue={gigDetails && gigDetails.description}
                            />
                        </div>

                        <div className="mb-6 pt-4">
                            <label className="mb-5 block text-xl font-semibold text-[#07074D]">
                                Product image
                            </label>

                            <div className="mb-8">
                                <input
                                    onChange={handleFileChange}
                                    type="file"
                                    name="file"
                                    id="file"
                                    className="sr-only"
                                    defaultValue={gigDetails.productImg}
                                    required />
                                <label
                                    for="file"
                                    className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
                                >
                                    <div>
                                        {file || gigDetails.productImg ? file.name || gigDetails.productImg : <><span className="mb-2 block text-xl font-semibold text-[#07074D]">
                                            Drop files here
                                        </span><span className="mb-2 block text-base font-medium text-[#6B7280]">
                                                Or
                                            </span><span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                                                Browse
                                            </span></>}
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div className="my-8">
                            <h1 className="my-3">Select a category</h1>
                            <select
                                name="category"
                                // value={}
                                onChange={handleInputChange}
                                className="block w-full text-sm font-medium transition duration-75 border border-gray-800 rounded-lg shadow-sm h-9 focus:border-blue-600 focus:ring-1 focus:ring-inset focus:ring-blue-600 bg-none"
                            >
                                <option value="-Select">--Select</option>
                                {categories && categories.map((val) => (
                                    <option value={val.category}>
                                        {val.category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <h1 className="my-2">Price In Dollars</h1>
                            <input
                                onChange={handleInputChange}
                                type="number"
                                name="price"
                                id="price"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md mb-5"
                                required
                                defaultValue={gigDetails && gigDetails.price}
                            />
                        </div>
                        <div>
                            <button className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none focus:ring">
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div></>
    );
};

export default GigEdit;
