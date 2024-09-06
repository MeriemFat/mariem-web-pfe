import React, { useEffect } from "react";
import { GiWhistle } from "react-icons/gi";
import { GrUserManager } from "react-icons/gr";
import { FaUserPen } from "react-icons/fa6";
import { MdManageAccounts } from "react-icons/md";
import Role from "../../../../utils/Role";
import { useRoleRequest } from "../../../../Hooks/useRoleRequest";
import { Controller, useForm } from "react-hook-form";

const StepThree = () => {
    const { submitRequest, checkRequest } = useRoleRequest();
    const { control, handleSubmit, formState: { errors } } = useForm();

    const ROLE_OPTIONS = [
        { value: Role.COLLABORATEUR, label: 'Collaborateur', icon: <GiWhistle /> },
        { value: Role.ADMIN, label: 'Admin', icon: <GrUserManager /> },
        { value: Role.USER, label: 'User', icon: <FaUserPen /> },
        { value: Role.FOURNISSEUR, label: 'Fournisseur', icon: <MdManageAccounts /> },
    ];

    const onSubmit = async (data) => {
        try {
            await submitRequest(data.role);
        } catch (error) {
            console.error("Error submitting request:", error);
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                await checkRequest();
            } catch (error) {
                console.error("Error checking request:", error);
            }
        }

        fetchData();
    }, [checkRequest]);

    return (
        <section>
            <div className="row">
                <div className="col-lg-12 mb-4">
                    <div className="form-group mb-3">
                        <label className="form-label">
                            Choose your role request from this list and wait for approval from the admin within 24
                            hours. Check your email for a verification message.
                        </label>

                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="w-100" style={{width: '100%'}}>
                    <div className="form-group mb-3" style={{width: '100%'}}>
                        <Controller
                            style={{width: '100%'}}
                            name="role"
                            control={control}
                            rules={{required: true}}
                            render={({field}) => (
                                <select
                                    className="form-select"
                                    value={field.value}
                                    onChange={field.onChange}
                                    ref={field.ref}
                                >
                                    <option value="" disabled>
                                        Collaborate...
                                    </option>
                                    {ROLE_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                        {errors.role && <p className="text-danger mt-2">Role is required</p>}
                    </div>
                    <br></br>


                    <div className="d-flex justify-content-end mt-3">
                        <button className="btn btn-primary"  style={{paddingTop: '-20px' ,paddingBottom:"-20px"}} type="submit">
                            Send
                        </button>


                    </div>
                </form>
            </div>
        </section>
    );
};

export default StepThree;
