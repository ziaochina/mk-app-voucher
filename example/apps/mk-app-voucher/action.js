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
        const response = await this.webapi.editableTable.query()
        this.injections.reduce('load', response)
    }

    save = async () => {
        var form = this.metaAction.gf('data.form').toJS()
        console.log(form)
        //this.metaAction.toast('success', '保存成功')
        //this.load()
    }


    addrow = (ps) => {
        this.injections.reduce('addEmptyRow', ps.rowIndex + 1)
    }

    delrow = (ps) => {
        const list = this.metaAction.gf('data.list')
        const id = list.getIn([ps.rowIndex, 'id'])
        this.injections.reduce('delrow', id)
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