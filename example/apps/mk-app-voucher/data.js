export function getMeta() {
	return {
		name: 'root',
		component: 'Layout',
		className: 'mk-app-voucher',
		onFocus: '{{$focus}}',
		children: [{
			name: 'header',
			component: 'Layout',
			className: 'mk-app-voucher-header',
			children: [{
				name: 'left',
				component: 'Layout',
				className: 'mk-app-voucher-header-left',
				children: [{
					name: 'page',
					component: 'Button.Group',
					children: [{
						name: 'prev',
						component: 'Button',
						type: 'softly',
						size: 'small',
						icon: 'left',
						onClick: '{{$prev}}'
					}, {
						name: 'next',
						component: 'Button',
						type: 'softly',
						size: 'small',
						icon: 'right',
						onClick: '{{$next}}'
					}]
				}]
			}, {
				name: 'right',
				component: 'Layout',
				className: 'mk-app-voucher-header-right',
				children: [{
					name: 'save',
					component: 'Button',
					type: 'softly',
					onClick: '{{$save}}',
					children: '保存'
				}]
			}]

		}, {
			name: 'formHeader',
			component: 'Form',
			className: 'mk-app-voucher-form-header',
			children: [{
				name: 'nameItem',
				component: 'Form.Item',
				label: '姓名',
				required: true,
				children: [{
					name: 'name',
					component: 'Input',
					value: '{{data.form.name}}',
					onChange: "{{(e)=>$setField('data.form.name',e.target.value)}}",
				}]
			}, {
				name: 'mobileItem',
				component: 'Form.Item',
				label: '手机',
				required: true,
				children: [{
					name: 'mobile',
					component: 'Input.Number',
					value: '{{data.form.mobile}}',
					onChange: "{{(v)=>$setField('data.form.mobile',v)}}",
				}]
			}, {
				name: 'sexItem',
				component: 'Form.Item',
				label: '性别',

				children: [{
					name: 'sex',
					component: 'Radio.Group',
					value: '{{data.form.sex}}',
					onChange: "{{(e)=>$setField('data.form.sex',e.target.value)}}",
					children: [{
						name: 'man',
						value: '0',
						component: 'Radio',
						children: '男'
					}, {
						name: 'woman',
						value: '1',
						component: 'Radio',
						children: '女'
					}]
				}]
			}, {
				name: 'marriedItem',
				component: 'Form.Item',
				label: '已婚',
				children: [{
					name: 'married',
					component: 'Checkbox',
					checked: '{{data.form.married}}',
					onChange: "{{(e)=>$setField('data.form.married',e.target.checked)}}",
				}]
			}, {
				name: 'birthdayItem',
				component: 'Form.Item',
				label: '出生日期',
				children: [{
					name: 'birthday',
					component: 'DatePicker',
					value: '{{$stringToMoment(data.form.birthday)}}',
					onChange: "{{(d)=>$setField('data.form.birthday',$momentToString(d,'YYYY-MM-DD'))}}",
				}]
			}, {
				name: 'educationItem',
				component: 'Form.Item',
				label: '最高学历',
				children: [{
					name: 'education',
					component: 'Select',
					value: '{{data.form.education ? data.form.education.id: undefined }}',
					onChange: "{{$educationChange}}",
					children: {
						name: 'option',
						component: 'Select.Option',
						value: "{{ data.other.educationDataSource ? data.other.educationDataSource[_rowIndex].id : undefined}}",
						children: '{{data.other.educationDataSource ? data.other.educationDataSource[_rowIndex].name : undefined}}',
						_power: 'for in data.other.educationDataSource'
					}
				}]
			}, {
				name: 'signatureItem',
				component: 'Form.Item',
				label: '签名',
				className: 'mk-app-voucher-form-header-signature',
				children: [{
					name: 'signature',
					component: 'Input',
					value: '{{data.form.signature}}',
					onChange: "{{(e)=>$setField('data.form.signature',e.target.value)}}",
				}]
			}]
		}, {
			name: 'detailTitle',
			component: 'Tabs',
			type: 'card',
			size: 'small',
			children: [{
				name: 'tab1',
				component: 'Tabs.TabPane',
				key: '1',
				tab: '家庭情况'
			}]
		}, {
			name: 'formDetails',
			component: 'DataGrid',
			headerHeight: 40,
			rowsCount: '{{data.form.details.length}}',
			rowHeight: 40,
			readonly: false,
			enableSequence: true,
			enableAddDelrow: true,
			startSequence: 1,
			onAddrow: '{{$addrow}}',
			onDelrow: '{{$delrow}}',
			columns: [{
				name: 'name',
				component: 'DataGrid.Column',
				columnKey: 'name',
				flexGrow: 1,
				width: 100,
				header: {
					name: 'header',
					component: 'DataGrid.Cell',
					children: [{
						name: 'label',
						component: '::label',
						className: 'ant-form-item-required',
						children: '家庭成员姓名'
					}]
				},
				cell: `{{{
					return $cellGetter('name', _path);
				}}}`,
			}, {
				name: 'rela',
				component: 'DataGrid.Column',
				columnKey: 'rela',
				flexGrow: 1,
				width: 100,
				header: {
					name: 'header',
					component: 'DataGrid.Cell',
					children: [{
						name: 'label',
						component: '::label',
						className: 'ant-form-item-required',
						children: '关系'
					}]
				},
				cell: "{{$cellGetter('rela', _path)}}",
			}, {
				name: 'mobile',
				component: 'DataGrid.Column',
				columnKey: 'mobile',
				flexGrow: 1,
				width: 100,
				header: {
					name: 'header',
					component: 'DataGrid.Cell',
					children: '手机'
				},
				cell: "{{$cellGetter('mobile', _path)}}",
			}, {
				name: 'birthday',
				component: 'DataGrid.Column',
				columnKey: 'birthday',
				flexGrow: 1,
				width: 100,
				header: {
					name: 'header',
					component: 'DataGrid.Cell',
					children: '出生日期'
				},
				cell: "{{$cellGetter('birthday', _path)}}",
			}]
		}]
	}
}

export function getInitState() {
	return {
		data: {
			form: {
				sex: '0',
				education: { id: '0', name: '本科' },
				details: [{}]
			},
			other: {}
		}
	}
}