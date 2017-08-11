import { Map, fromJS } from 'immutable'
import { reducer as MetaReducer } from 'mk-meta-engine'
import config from './config'
import { getInitState } from './data'
import moment from 'moment'

class reducer {
    constructor(option) {
        this.metaReducer = option.metaReducer
        this.config = config.current
    }

    init = (state, option) => {
        const initState = getInitState()
        return this.metaReducer.init(state, initState)
    }

    load = (state, response) => {
        response.list.forEach(o=>o.birthday = moment(o.birthday))
        state = this.metaReducer.sf(state, 'data.list', fromJS(response.list))
        return this.metaReducer.sf(state, 'data.other.focusCellInfo', undefined)
    }

    addEmptyRow = (state, rowIndex) => {
        var details = this.metaReducer.gf(state, 'data.form.details')
        details = details.insert(rowIndex,Map({
            _index: details.size
        }))

        return this.metaReducer.sf(state, 'data.form.details', details)
    }

    delrow = (state, index) => {
        var details = this.metaReducer.gf(state, 'data.form.details')
       
        if (index == -1)
            return state

        details = details.remove(index)
        return this.metaReducer.sf(state, 'data.form.details', details)
    }
}

export default function creator(option) {
    const metaReducer = new MetaReducer(option),
        o = new reducer({ ...option, metaReducer })

    return { ...metaReducer, ...o }
}