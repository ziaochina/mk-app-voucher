import { config, start, componentFactory } from 'mk-meta-engine'
import * as mkComponents from 'mk-component'
import myConfig  from './config'

import mk_app_voucher_education from './apps/mk-app-voucher/apps/mk-app-voucher-education/index.js'
import mk_app_voucher from './apps/mk-app-voucher/index.js'

const apps = {
		
	[mk_app_voucher_education.name]: mk_app_voucher_education,	
	[mk_app_voucher.name]: mk_app_voucher,
}

apps.config = (options) => {
	Object.keys(options).forEach(key => {
		const reg = new RegExp(`^${key == '*' ? '.*' : key}$`)
		Object.keys(apps).forEach(appName => {
			if (appName != 'config') {
				if (reg.test(appName)) {
					apps[appName].config(options[key])
				}
			}
		})
	})
}

apps.config({ '*': { apps } })

config(myConfig({ apps }))

Object.keys(mkComponents).forEach(key=>{
	componentFactory.registerComponent(key, mkComponents[key])
})
	
start()