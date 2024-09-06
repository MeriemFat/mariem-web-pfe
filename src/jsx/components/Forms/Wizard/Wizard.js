import React, { Fragment, useState } from "react";
//import Multistep from "react-multistep";
import { Stepper, Step } from 'react-form-stepper';

import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import PageTitle from "../../../layouts/PageTitle";

const Wizard = () => {
	const [goSteps, setGoSteps] = useState(0);

	return (
		<Fragment>
			<PageTitle activeMenu="role Request" motherMenu="Home" />

			<div className="row">
				<div className="col-xl-12 col-xxl-12">
					<div className="card">
						<div className="card-header">
						</div>
						<div className="card-body">
						
							<div className="form-wizard ">
								<Stepper className="nav-wizard" activeStep={goSteps} label={false}>
									<Step className="nav-link" onClick={() => setGoSteps(0)} />
									<Step className="nav-link" onClick={() => setGoSteps(1)} />
									<Step className="nav-link" onClick={() => setGoSteps(2)} />
								</Stepper>
							  {goSteps === 0 && (
								<>
									<StepOne />	
									<div className="text-end toolbar toolbar-bottom p-2">
										<button  className="btn btn-primary sw-btn-next" onClick={() => setGoSteps(1)}>Next</button>
									</div>	
								</>
							  )}
							  {goSteps === 1 && (
								<>
									<StepTwo />
									<div className="text-end toolbar toolbar-bottom p-2">
										<button  className="btn btn-secondary sw-btn-prev me-1" onClick={() => setGoSteps(0)}>Prev</button>
										<button className="btn btn-primary sw-btn-next ms-1" onClick={() => setGoSteps(2)}>Next</button>
									</div>	
								</>
							  )}
							  {goSteps === 2 && (
								<>
									<StepThree />
										{/*
										<button  className="btn btn-secondary" onClick={() => setGoSteps(1)}>Prev</button>
*/}

								</>
							  )}


							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Wizard;
