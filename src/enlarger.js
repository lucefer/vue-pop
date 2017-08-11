let helper = require('./helper')

let maskStyle = {
    position: 'fixed',
    display: 'none',
    zIndex: '99000',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0
}
let stylesCausedReflow = ['position', 'display', 'float', 'left', 'right', 'top', 'bottom', 'font', 'line-height', 'vertical-align', 'margin-top', 'margin-right', 'margin-left', 'margin-right',
    'padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'border-radius'
]
let browserPrefix = 'webkitAppearance' in document.body.style ? '-webkit-' : ''
let mask = document.createElement('div'),
    targetWrapper = document.createElement('div'),
    targetEle, targetHolderEle, parentEle

let shown = false,
    locked = false,
    oldStyle

let viewRect = {}

let docWidth = document.documentElement.clientWidth,
    docHeight = document.documentElement.clientHeight

function resetRect() {
    docWidth = document.documentElement.clientWidth,
        docHeight = document.documentElement.clientHeight
    viewRect.width = docWidth
    viewRect.height = docHeight
}
window.addEventListener("resize", resetRect)

let transitionPrefix = helper.getTransition(),
    transitionProp = transitionPrefix.transition,
    transformProp = transitionPrefix.transform,
    transformCssProp = transformProp.replace(/(.*)Transform/, '-$1-transform'),
    transEndEvent = transitionPrefix.transitionEnd
let scale = 1
helper.setStyle(mask, maskStyle)
helper.setStyle(targetWrapper, {
    position: 'fixed',
    left: '50%',
    top: '50%',
    zIndex: '99001'
})
document.body.appendChild(mask)
viewRect.width = docWidth
viewRect.height = docHeight
var enlarger = {

    show: function show(el, options) {
        if (shown || locked) return

        helper.setStyle(mask, {
            backgroundColor: el.popData.bgColor,
            transition: 'opacity ' + el.popData.transitionDuration + ' ' + el.popData.transitionTimingFunction
        })
        targetEle = el

        if (options.beforeOpened) options.beforeOpened(targetEle)

        shown = locked = true

        parentEle = targetEle.parentNode

        let box = targetEle.getBoundingClientRect()

        targetInsteadHolder = helper.copyStyle(stylesCausedReflow, targetEle, box);
        targetInsteadHolder.style.visibility = 'hidden'
        var disX = box.left - (docWidth - box.width) / 2,
            disY = box.top - (docHeight - box.height) / 2;
        oldStyle = helper.setStyle(targetEle, {
            position: 'absolute',
            top: 0,
            left: 0,
            right: '',
            bottom: '',
            marginTop: -box.height / 2 + "px",
            marginLeft: -box.width / 2 + "px",
            cursor: browserPrefix + "zoom-out",
            webkitTransform: 'translate(' + disX + 'px,' + disY + 'px)',
            webkitTransition: '',
            transform: 'translate(' + disX + 'px,' + disY + 'px)',
            transition: '',
            whiteSpace: 'nowrap'
        }, true)

        parentEle.insertBefore(targetInsteadHolder, targetEle)
        parentEle.appendChild(targetWrapper)
        targetWrapper.appendChild(targetEle)
        mask.style.display = "block"
        targetEle.offsetWidth
        mask.style.opacity = options.opacity

        scale = Math.min(options.width / box.width, options.height / box.height)
        helper.setStyle(targetEle, {
            webkitTransform: 'scale(' + scale + ')',
            transform: 'scale(' + scale + ')',
            webkitTransition: '-webkit-transform ' + options.transitionDuration + ' ' + options.transitionTimingFunction,
            transition: 'transform '  + options.transitionDuration + ' ' + options.transitionTimingFunction
        })

        targetEle.addEventListener(transEndEvent, function end() {
            targetEle.removeEventListener(transEndEvent, end)

            if (options.afterOpened && typeof options.afterOpened === 'function') {
                options.afterOpened(targetEle)
            }
            locked = false
        })
        return this
    },
    close: function close() {
        if (!shown || locked) return
        locked = true

        if (targetEle.popData.beforeClosed) targetEle.popData.beforeClosed(targetEle)

        var pBox = targetInsteadHolder.getBoundingClientRect(),
            dx = pBox.left - (viewRect.width - pBox.width) / 2,
            dy = pBox.top - (viewRect.height - pBox.height) / 2

        mask.style.opacity = 0
        helper.setStyle(targetEle, {
            webkitTransform: 'translate(' + dx + 'px,' + dy + 'px)',
            transform: 'translate(' + dx + 'px,' + dy + 'px)'
        })

        targetEle.addEventListener(transEndEvent, function end() {
            targetEle.removeEventListener(transEndEvent, end)

            helper.setStyle(targetEle, helper.extendStyle(oldStyle, {
                webkitTransform: 'none',
                transform: 'none'
            }))

            parentEle.insertBefore(targetEle, targetInsteadHolder)
            parentEle.removeChild(targetInsteadHolder)
            parentEle.removeChild(targetWrapper)

            mask.style.display = "none"
                // targetInsteadHolder = null

            shown = locked = false
            if (targetEle.popData.afterClosed && typeof targetEle.popData.afterClosed === 'function')
                targetEle.popData.afterClosed(targetEle)
        })
        return this
    },
    trigger: function(e) {
        e.stopPropagation()
        if (shown) {
            enlarger.close(this.popData)
        } else {
            enlarger.show(this, this.popData)
        }

    },
    bind: function bind(el) {
        helper.setStyle(mask, {
            backgroundColor: el.popData.bgColor,
            transition: 'opacity ' + el.popData.transitionDuration + ' ' + el.popData.transitionTimingFunction
        })

        helper.setStyle(el, {
            'cursor': browserPrefix + 'zoom-in'
        })
        el.addEventListener("click", this.trigger)
    },
    update: function(el) {
        helper.setStyle(mask, {
            backgroundColor: el.popData.bgColor,
            transition: 'opacity ' + el.popData.transitionDuration + ' ' + el.popData.transitionTimingFunction
        })

        helper.setStyle(el, {
            'cursor': browserPrefix + 'zoom-in'
        })
    },
    unbind: function unbind(el) {
        el.removeEventListener(this.trigger)
    }
}

mask.addEventListener("click", enlarger.close)
targetWrapper.addEventListener("click", enlarger.close)

exports.enlarger = enlarger
