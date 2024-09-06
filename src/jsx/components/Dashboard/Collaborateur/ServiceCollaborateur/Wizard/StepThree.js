import React from "react";
import { GiWhistle } from "react-icons/gi";
import { GrUserManager } from "react-icons/gr";
import { FaUserPen } from "react-icons/fa6";
import { Controller, useForm } from "react-hook-form";
import Type from "../../../../../../utils/Type";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuthContext } from "../../../../../../services/useAuthContext";
import {useNavigate} from "react-router-dom";
import swal from "sweetalert";

const StepThree = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const { USER } = useAuthContext();
    const navigate = useNavigate();

    const TYPE_OPTIONS = [
        { value: Type.BIRTHDAY, label: 'BIRTHDAY', icon: <GiWhistle /> },
        { value: Type.EVENT, label: 'EVENT', icon: <GrUserManager /> },
        { value: Type.MEETING, label: 'MEETING', icon: <FaUserPen /> },
    ];

    const onSubmit = async (data) => {
        try {
            const userResponse = await axios.get(`http://localhost:3000/User/getbyemail?email=${USER.email}`);
            const userId = userResponse.data._id;

            const serviceData = {
                description: data.description,
                startDate: data.startDate,
                nombrePersonne: data.nombrePersonne,
                lieu: data.lieu,
                type: data.type,
                user: userId
            };

            const response = await axios.post(`http://localhost:3000/service/add/`, serviceData);
            await swal("Good job!", "Service added successfully", "success")
            navigate('/service-list')
        } catch (error) {
            console.error('Error adding service:', error);
            toast.error('Failed to add service');
        }
    };

    return (
        <section>
            <div className="row">
                <div className="col-lg-12 mb-4">
                    <form className="w-100" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group mb-3">
                            <label className="text-label">Service Description*</label>
                            <Controller
                                name="description"
                                control={control}
                                defaultValue=""
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <textarea
                                        className="form-control"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.description && <p className="text-danger mt-2">Description is required</p>}
                        </div>
                        <br />
                        <div className="form-group mb-3">
                            <label className="text-label">Start Date*</label>
                            <Controller
                                name="startDate"
                                control={control}
                                defaultValue=""
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <input
                                        type="date"
                                        className="form-control"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.startDate && <p className="text-danger mt-2">Start Date is required</p>}
                        </div>
                        <br />
                        <div className="form-group mb-3">
                            <label className="text-label">Number of people*</label>
                            <Controller
                                name="nombrePersonne"
                                control={control}
                                defaultValue="Number of people"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <input
                                        type="number"
                                        className="form-control"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.nombrePersonne && <p className="text-danger mt-2">Number of people is required</p>}
                        </div>
                        <br />
                        <div className="form-group mb-3">
                            <label className="text-label">Location*</label>
                            <Controller
                                name="lieu"
                                control={control}
                                defaultValue=""
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <input
                                        type="text"
                                        className="form-control"
                                        {...field}
                                    />
                                )}
                            />
                            {errors.lieu && <p className="text-danger mt-2">Location is required</p>}
                        </div>
                        <br />
                        <div className="form-group mb-3">
                            <label className="text-label">Type*</label>
                            <Controller
                                name="type"
                                control={control}
                                defaultValue=""
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <select
                                        className="form-select"
                                        {...field}
                                    >
                                        <option value="" disabled>
                                            Select Type...
                                        </option>
                                        {TYPE_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                            {errors.type && <p className="text-danger mt-2">Type is required</p>}
                        </div>
                        <br />
                        <div className="d-flex justify-content-end mt-3">
                            <button className="btn btn-primary" type="submit">
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default StepThree;
