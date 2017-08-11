let enlargerObject = require('./enlarger');
let enlarger = enlargerObject.enlarger;
(function() {
    let vuePop = {}


    function setBinding(binding) {

        if(!binding){
          this.bgColor = '#000'
          this.transitionDuration = '0.5s'
          this.transitionTimingFunction = 'cubic-bezier(0.5,0,0,1)'
          this.afterOpened = null
          this.afterClosed = null
          this.opacity = .5
          this.width = Math.ceil(document.body.getBoundingClientRect().width / 2)
          this.height = Math.ceil(window.innerHeight / 2)
          return
        }
        this.bgColor = binding.bgColor || '#000'
        this.transitionDuration = binding.duration || '0.5s'
        this.transitionTimingFunction = binding.transitionTimingFunction || 'cubic-bezier(0.5,0,0,1)'
        this.opacity = .5
        this.afterOpened = binding.afterOpened || null
        this.afterClosed = binding.afterClosed || null
        this.width = binding.width || Math.ceil(document.body.getBoundingClientRect().width / 2)
        this.height = binding.height || Math.ceil(window.innerHeight / 2)
    }

    function Data(binding) {
        setBinding.call(this, binding)
    }
    Data.prototype.update = function(binding) {
        setBinding.call(this, binding)
    }
    vuePop.install = function(Vue) {
        Vue.directive('pop', {
            bind: function(el, binding) {
                el.popData = new Data(binding.value)
            },
            update: function(el, binding) {
                if(binding.value === binding.oldValue){
                  return
                }
                el.popData.update(binding.value)
                enlarger.update(el)
            },
            inserted: function(el) {
                enlarger.bind(el)
            },
            unbind: function() {
                enlarger.unbind(el)
            }
        })
    }
    if (typeof exports === 'object') {
        module.exports = vuePop
    } else if (typeof define === 'function' && define.amd) {
        define([], function() {
            return vuePop
        })
    } else if (window.Vue) {
        window.vuePop = vuePop
        Vue.use(vuePop)
    }
})()
