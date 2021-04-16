<template>
	<div class="free-time">
		<div class="container">
			<DatePicker
				v-model="selected.date"
				mode="dateTime"
				is-range
				is24hr
				:mask="masks"
			>
				<template #default="{togglePopover, inputValue, hidePopover}">
					<div class="free-time__add-range">
						<div
							v-if="dates.length > 0"
							class="free-time__inner"
						>
							<div
								class="free-time__textfields"
								v-for="itemDate in dates"
								:key="itemDate.id"
							>
								<div class="textfield">
									<svg
										fill="none"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										viewBox="0 0 24 24"
										stroke="currentColor"
										width="20px"
										height="20px"
									>
										<path
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										></path>
									</svg>
									<input
										class="textfield__control"
										ref="startDate"
										v-model="itemDate.formattedDate.start"
										@blur="changeSelectedDate(itemDate.formattedDate)"
										@focus="dateSelected($event, itemDate, togglePopover)"
									/>
								</div>
								<div class="textfield">
									<svg
										fill="none"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										viewBox="0 0 24 24"
										stroke="currentColor"
										width="20px"
										height="20px"
									>
										<path
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										></path>
									</svg>
									<input
										class="textfield__control"
										:class="{'textfield__control--error': !itemDate.corrected }"
										ref="endDate"
										v-model="itemDate.formattedDate.end"
										@blur="changeSelectedDate(itemDate.formattedDate)"
										@focus="dateSelected($event, itemDate, togglePopover)"
									/>
								</div>
								<button
									class="button button--gray button-close free-time__btn-close"
									@click.stop="removeDate(itemDate, hidePopover)"
								>
									<svg
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
										width="12px"
										height="12px"
									>
										<path d="M6 18L18 6M6 6l12 12"></path>
									</svg>
								</button>
								<p
									v-if="!itemDate.corrected"
									class="free-time__error-text"
								>
									{{ errorText }}
								</p>
							</div>
						</div>
					</div>
				</template>
			</DatePicker>
			<label class="free-time__label">
				Добавить свое свободное время
			</label>
			<button
				class="button button--blue free-time__btn-add"
				@click.stop="addDate"
			>
				+ Добавить
			</button>
		</div>
	</div>
</template>

<script>
import DatePicker from 'v-calendar/lib/components/date-picker.umd'

export default {
	name: 'FreeTime',
	components: {
		DatePicker
	},
	data() {
		return {
			dates: [],
			selected: {},
			masks: {
				inputDateTime24hr: 'YYYY-MM-DD HH:mm',
			},
			isDateCorrected: true,
			errorText: 'Вы не можете выбрать период больше 12 часов'
		}
	},
	watch: {
		selected: {
			handler(val) {
				let diff = new Date(val.date.end).getTime() - new Date(val.date.start).getTime();
				let seconds = diff / 1000;
				let minutes = seconds / 60;
				let hours = minutes / 60;
				let days = hours / 24;

				console.log(days);

				let findDateIndex = this.dates.findIndex(d => d.id === val.id);
				(days <= 0 || days > 0.5)
					? this.dates[findDateIndex].corrected = false
					: this.dates[findDateIndex].corrected = true
			},
			deep: true
		}
	},
	methods: {
		addDate() {
			let date = new Date();
			let endDate = date.getTime() + (12 * 60 * 60 * 1000);
			let startFormattedDate = this.$formatterDate.getDate24Time(date);
			let endFormattedDate = this.$formatterDate.getDate24Time(endDate);
			let id = this.dates.length + 1

			let addDate = {
				id: id,
				date: {
					start: startFormattedDate,
					end: endFormattedDate,
				},
				formattedDate: {
					start: startFormattedDate,
					end: endFormattedDate,
				},
				corrected: true
			}

			this.dates.push(addDate);
			this.selected = addDate;
		},
		dateSelected(e, date, toggle) {
			this.selected = date;
			toggle({ref: e.target});
		},
		removeDate(date, hide) {
			this.dates = this.dates.filter(itemDate => itemDate !== date);
			hide();
		},
		changeSelectedDate(formattedDate) {
			this.selected.date.start = new Date(formattedDate.start);
			this.selected.date.end = new Date(formattedDate.end);
		}
	}
}
</script>

<style>

.free-time {
	padding: 40px 0;
}

.free-time__textfields {
	display: flex;
	align-items: center;
	flex-wrap: wrap;

	margin-bottom: 5px;
}

.free-time__textfields:last-child {
	margin-bottom: 35px;
}

.free-time__label {
	display: block;

	font-size: 14px;
}

.free-time__btn-add {
	margin-top: 15px;
}

.free-time__btn-close {
	margin-left: 5px;
}

.free-time__error-text {
	width: 100%;
	padding: 0;
	margin: 0;

	font-size: 12px;
	color: #f37070;
}

.textfield {
	position: relative;
}

.textfield:nth-child(1) {
	position: relative;

	margin-right: 15px;
}

.textfield:nth-child(1)::before {
	position: absolute;
	left: calc(100% + 5px);
	top: 50%;

	width: 5px;
	height: 1px;

	background-color: #222222;
	transform: translateY(-50%);

	content: '';
}

.textfield svg {
	position: absolute;
	top: 50%;
	left: 7px;

	width: 15px;
	height: 15px;

	transform: translateY(-50%);
}

.textfield__control {
	padding: 8px 10px 8px 28px;
	width: 160px;

	font-size: 14px;
	font-weight: normal;
	line-height: normal;

	border-radius: 4px;
	border: 1px solid #EAEDF3;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
	color: #394E66;
	outline: none;

	transition: all 0.2s ease;
}

.textfield__control--error {
	border-color: #f37070;
}

.textfield__control:focus {
	border: 1px solid;
	outline: none;
}

.textfield__control:-webkit-autofill,
.textfield__control:-webkit-autofill:hover {
	transition: background-color 5000s ease-in-out 0s;
	-webkit-box-shadow: 0 0 0px 1000px white inset;
	-webkit-text-fill-color: black;
}

.textfield__control:-webkit-autofill:focus,
.textfield__control:-webkit-autofill:active {
	transition: background-color 5000s ease-in-out 0s;
	-webkit-box-shadow: 0 0 0px 1000px white inset,
	0 0 0 0.2rem rgba(41, 98, 255, 0.25);
	-webkit-text-fill-color: black;
}

.textfield__control::-webkit-input-placeholder {
	font-weight: 400;
	font-size: 14px;

	color: #A3B3C6;
}

.textfield__control::-moz-placeholder {
	font-weight: 600;
	font-size: 14px;

	color: #A3B3C6;
}

.textfield__control:-moz-placeholder {
	font-weight: 600;
	font-size: 14px;

	color: #A3B3C6;
}

.textfield__control:-ms-input-placeholder {
	font-weight: 600;
	font-size: 14px;

	color: #A3B3C6;
}

.textfield__control:focus,
.textfield__control:active {
	border: 1px solid #3763F5;
	box-shadow: 0 0 3px rgba(55, 99, 245, 0.22)
}


.button {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 32px;
	padding: 6px 15px;

	font-size: 13px;
	line-height: 1;
	font-weight: normal;

	background-color: transparent;
	border: 1px solid transparent;
	border-radius: 4px;

	user-select: none;
	touch-action: manipulation;
	text-decoration: none;
	cursor: pointer;
	outline: none;

	transition: all 0.2s ease;
}

.button:active,
.button:hover,
.button:focus {
	outline: none;
}

.button--blue {
	background-color: #3763F5;
	color: #fff;
}

.button--blue:hover {
	background-color: #5F82F7;
	color: #fff;
}

.button--blue:active {
	background-color: #224BD6;
	color: #fff;
}

.button-close {
	width: 20px;
	height: 20px;
	padding: 0;
}

.button-close svg {
	transition: all 0.3s ease;
}

.button-close:hover svg {
	stroke: #3763F5;
}

@media screen and (max-width: 767px) {
	.free-time {
		padding: 25px 0;
	}

	.textfield {
		flex-grow: 0;
		flex: 1;
	}

	.textfield svg {
		display: none;
	}

	.textfield__control {
		padding-left: 10px;
		padding-right: 10px;
		width: 100%;
	}

	.free-time__label {
		text-align: center;
	}

	.free-time__btn-add {
		width: 100%;
	}

	.textfield:nth-child(1) {
		margin-right: 10px;
	}

	.textfield:nth-child(1)::before {
		left: calc(100% + 2.5px);
	}

}

</style>
