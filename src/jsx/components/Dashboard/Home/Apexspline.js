import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { useAuthContext } from '../../../../services/useAuthContext';

const Apexspline = () => {
	const [render, setRender] = useState(false);
	const [series, setSeries] = useState([]);
	const { USER } = useAuthContext();

	useEffect(() => {
		const fetchBuffetData = async () => {
			try {
				const userResponse = await axios.get(`http://localhost:3000/User/getbyemail?email=${USER.email}`);
				const userId = userResponse.data._id;

				const response = await axios.get(`http://localhost:3000/buffet/getbyuserId/${userId}`);
				const buffets = response.data;

				const revenueData = buffets.map(buffet => buffet.price * buffet.quantity);
				// Suppose 20% profit margin
				const profitData = revenueData.map(revenue => revenue * 0.01);
				//const prof = Math.round(profitData.reduce((a, b) => a + b, 0));

				setSeries([
					{ name: 'Net Profit', data: profitData },
					{ name: 'Revenue', data: revenueData }
				]);

				setRender(true);
			} catch (error) {
				console.error('Error fetching buffet data:', error);
			}
		};

		fetchBuffetData();
	}, [USER.email]);

	const options = {
		chart: {
			height: 350,
			type: 'area',
			toolbar: {
				show: false
			}
		},
		colors: ['#e5aff8', '#e3366b'],
		dataLabels: {
			enabled: false,
		},
		legend: {
			show: true,
			fontSize: '12px',
			labels: {
				colors: '#000000',
			},
			position: 'bottom',
			horizontalAlign: 'center',
			markers: {
				width: 19,
				height: 19,
				strokeWidth: 0,
				strokeColor: '#fff',
				fillColors: undefined,
				radius: 4,
				offsetX: 0,
				offsetY: 0
			}
		},
		xaxis: {
			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
			labels: {
				style: {
					colors: '#3e4954',
					fontSize: '13px',
					fontFamily: 'Poppins',
					fontWeight: 100,
					cssClass: 'apexcharts-xaxis-label',
				},
			},
			crosshairs: {
				show: false,
			}
		},
		yaxis: {
			categories: [11, 32, 45, 32, 34, 52, 41],
			labels: {
				style: {
					colors: '#3e4954',
					fontSize: '13px',
					fontFamily: 'Poppins',
					fontWeight: 100,
					cssClass: 'apexcharts-xaxis-label',
				},
			},
			forceNiceScale: true,
			tooltip: {
				enabled: true,
				formatter: function (val) {
					return Number(val).toFixed(0) + " DT";
				}
			}
		},
		fill: {
			type: 'solid',
			opacity: 0.8,
		},
		tooltip: {
			y: {
				formatter: function (val) {
					return Number(val).toFixed(0) + " DT"; // Limite à 0 décimales et ajoute " DT"
				}
			}
		}
	};

	return (
		render ? (
			<div id="chart">
				<ReactApexChart options={options} series={series} type="area" width="100%" height={350} />
			</div>
		) : null
	);
};

export default Apexspline;
