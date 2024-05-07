import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import axios from "axios"
import { apiUrl } from "../../apiUrl"
import { toast, Toaster } from "react-hot-toast"


const CommentsAndRatings = () => {
    const { orderid, gigId, sellerId, buyerId } = useParams();
    const [comments, setComments] = useState();
    const [ratingsN, setratingsN] = useState(0);
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            let submitData = { comment: comments, rating: ratingsN };
            let { data } = await axios.patch(`${apiUrl}/user/rateSeller/${gigId}/${buyerId}`, submitData)
            if (data.success) {
                toast.success("Thanks for Your Feedback. Good luck!")
                setComments();
                setratingsN();
                navigate(-1)
            }
        } catch (error) {
            console.log("error in handleSubmit comments and ratings")
        }
    };


    const changeRating = (newRating, name) => {
        console.log(newRating, name)
        setratingsN(newRating)
    };

    return (
        <div className="bg-gray-100 p-6">
            <Toaster />
            <Link className="text-sm text-blue-500 ml-5" to={"/"}>&larr; Home</Link>
            <h2 className='text-center my-10 font-bold underline text-gray-500 text-lg'>Add Your Best Comment and Rating To The Seller</h2>
            <div className="flex flex-col space-y-4">

                <form className="bg-white p-4 rounded-lg shadow-md" onSubmit={handleSubmit}>
                    <h3 className="text-lg font-bold mb-2">Add a comment</h3>

                    <div className="mb-4">
                        <label className="block text-gray-500 font-bold mb-2" htmlFor="comment">
                            Comment
                        </label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="comment"
                            rows="3"
                            placeholder="Enter your comment..,"

                            onChange={(e) => setComments(e.target.value)}
                        />
                        <p className='my-2 text-gray-500'>Please Rate Your Experience with Seller:</p>
                        <StarRatings
                            rating={ratingsN}
                            starRatedColor="darkyellow"
                            changeRating={changeRating}
                            numberOfStars={5}
                            name='rating'
                            starSpacing='10px'
                            starDimension='35px'
                        />
                    </div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:ring"
                        type="submit"
                    >
                        Post Your Reviews
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CommentsAndRatings;
