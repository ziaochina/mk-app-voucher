import React from 'react'
import ReactDOM from 'react-dom'
import { action as MetaAction, AppLoader } from 'mk-meta-engine'
import config from './config'
import { Input, DataGrid, DatePicker, Select } from 'mk-component'
import { Map } from 'immutable'
import moment from 'moment'

class action {
    constructor(option) {
        this.metaAction = option.metaAction
        this.config = config.current
        this.webapi = this.config.webapi
    }

    onInit = ({ component, injections }) => {
        this.component = component
        this.injections = injections
        injections.reduce('init')
        this.load()
    }

    load = async () => {
        const payload = {}
        const response = await this.webapi.voucher.init({id:this.component.props.voucherId})
        debugger
        payload.voucher = response.voucher
        payload.educationDataSource = response.educations
        payload.relaDataSource = response.relas
        this.injections.reduce('load', payload)
    }


    prev = async () => {
        const id = this.metaAction.gf('data.form.id')
        const response = await this.webapi.voucher.prev(id)
        if (response) {
            this.injections.reduce('setVoucher', response)
        }
    }

    next = async () => {
        const id = this.metaAction.gf('data.form.id')
        const response = await this.webapi.voucher.next(id)
        if (response) {
            this.injections.reduce('setVoucher', response)
        }
    }

    checkSave(form) {
        var msg = []
        if (!form.name) {
            msg.push('姓名不能为空!')
        }

        if (!form.mobile)
            msg.push('手机不能为空!')

        if (!form.details || form.details.length == 0) {
            msg.push('家庭情况不能为空！')
        }

        form.details.forEach((detail, index) => {
            if (!detail.name)
                msg.push(`家庭情况第${index + 1}行，家庭成员姓名不能为空！`)

            if (!detail.rela)
                msg.push(`家庭情况第${index + 1}行，关系不能为空！`)
        })

        return msg
    }

    save = async () => {
        var form = this.metaAction.gf('data.form').toJS()
        const msg = this.checkSave(form)

        if (msg.length > 0) {
            this.metaAction.toast('error',
                <ul style={{ textAlign: 'left' }}>
                    {msg.map(o => <li>{o}</li>)}
                </ul>
            )
            return
        }

        form.birthday = form.birthday.format('YYYY-MM-DD')
        form.details = form.details.map(detail => ({ ...detail, birthday: detail.birthday ? detail.birthday.format('YYYY-MM-DD') : undefined }))
        if (form.id || form.id == 0) {
            const response = await this.webapi.voucher.update(form)
            if (response) {
                this.metaAction.toast('success', '保存单据成功')
                this.injections.reduce('setVoucher', response)
            }

        }
        console.log(form)
    }

    educationChange = (v) => {
        const educationDataSource = this.metaAction.gf('data.other.educationDataSource')
        const education = educationDataSource.find(o => o.get('id') == v)
        this.metaAction.sf(`data.form.education`, education)
    }


    addrow = (ps) => {
        this.injections.reduce('addEmptyRow', ps.rowIndex + 1)
    }

    delrow = (ps) => {
        this.injections.reduce('delrow', ps.rowIndex)
    }

    cellClick = (e) => {
        const path = this.findPathByEvent(e)
        if (this.isFocusCell(path)) return

        this.metaAction.sf('data.other.focusFieldPath', path)

        const that = this
        setTimeout(() => {
            const editorDOM = ReactDOM.findDOMNode(that.component).querySelector(".edit-control")
            if (editorDOM.select)
                editorDOM.select()

            else if (editorDOM.querySelector('input')) {
                editorDOM.querySelector('input').click()
            }
        }, 16)
    }

    cellGetter = (columnKey, path) => (ps) => {
        var cellValue = this.metaAction.gf(`data.form.details.${ps.rowIndex}.${columnKey}`)
        var showValue = cellValue
        var currPath = `${path},${ps.rowIndex}`

        if (columnKey == 'birthday') {
            showValue = cellValue ? cellValue.format('YYYY-MM-DD') : cellValue
        }
        else if (columnKey == 'rela') {
            showValue = cellValue ? cellValue.get('name') : ''
        }


        if (!this.isFocusCell(currPath)) {
            return (
                <DataGrid.TextCell
                    onClick={this.cellClick}
                    value={showValue}
                    path={currPath}
                />
            )
        }

        if (columnKey == 'name') {
            return (
                <Input
                    className='mk-app-voucher-cell edit-control'
                    onChange={(e) => this.metaAction.sf(`data.form.details.${ps.rowIndex}.name`, e.target.value)}
                    value={cellValue}
                    path={currPath}
                />
            )
        }
        else if (columnKey == 'mobile') {
            return (
                <Input.Number
                    className='mk-app-voucher-cell edit-control'
                    onChange={(v) => this.metaAction.sf(`data.form.details.${ps.rowIndex}.mobile`, v)}
                    value={cellValue}
                    path={currPath}
                />
            )
        }

        else if (columnKey == 'birthday') {
            return (
                <DatePicker
                    className='mk-app-voucher-cell edit-control'
                    onChange={(v) => this.metaAction.sf(`data.form.details.${ps.rowIndex}.birthday`, v)}
                    value={moment(cellValue)}
                    path={currPath}
                />
            )
        }

        else if (columnKey == 'rela') {
            const relaDataSource = this.metaAction.gf('data.other.relaDataSource')
            return (
                <Select
                    className='mk-app-voucher-cell edit-control'
                    allowClear
                    onChange={(v) => {
                        const rela = relaDataSource.find(o => o.get('id') == v)
                        this.metaAction.sf(`data.form.details.${ps.rowIndex}.rela`, rela)
                    }}
                    value={cellValue ? cellValue.get('id') : undefined}
                    path={currPath}
                >
                    {relaDataSource.map(o => <Option value={o.get('id')}>{o.get('name')} </Option>)}
                </Select>
            )
        }
    }


    focus = (e) => {
        const path = this.findPathByEvent(e)
        if (this.isFocusCell(path)) return
        this.metaAction.sf('data.other.focusFieldPath', path)
    }

    findPathByEvent = (e) => {
        const loop = (inst) => {
            const p = inst._currentElement
                && inst._currentElement._owner
                && inst._currentElement._owner._currentElement
                && inst._currentElement._owner._currentElement.props.path

            if (!p && inst)
                return loop(inst._hostParent)

            return p
        }
        return loop(e._targetInst)
    }


    isFocusCell = (path) => {
        const focusFieldPath = this.metaAction.gf('data.other.focusFieldPath')
        return path == focusFieldPath
    }
}

export default function creator(option) {
    const metaAction = new MetaAction(option),
        o = new action({ ...option, metaAction }),
        ret = { ...metaAction, ...o }

    metaAction.config({ metaHandlers: ret })

    return ret
}