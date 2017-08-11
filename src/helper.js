let ret = {}
let holder = document.createElement('div')
 function getTransition() {
    let trans = ['webkitTransition', 'transition', 'MozTransition'],
        tform = ['webkitTransform', 'transform', 'MozTransform'],
        end = {
            'transition': 'transitionend',
            'MozTransition': 'transitionend',
            'webkitTransition': 'webkitTransitionEnd'
        },
        checkedStyle = document.body.style

    trans.some(function(prop) {
        if (checkedStyle[prop] !== undefined) {
            ret.transition = prop
            ret.transitionEnd = end[prop]
            return true
        }
    })
    tform.some(function(prop) {
        if (checkedStyle[prop] !== undefined) {
            ret.transform = prop
            return true
        }
    })
    return ret
}

function checkTrans(styles) {
    if (styles.transition) {
        styles[ret.transition] = styles.transition;
    }
    if (styles.transform) {
        styles[ret.transform] = styles.transform;
    }
}

function setStyle(el, styles, remember) {
    checkTrans(styles)
    var s = el.style,
        original = {}
    for (var key in styles) {
        if (remember) {
            original[key] = s[key] || ''
        }
        s[key] = styles[key]
    }
    return original
}

function extendStyle(originalstyle, targetStyle) {
    for (var i in targetStyle) {
        originalstyle[i] = targetStyle[i]
    }
    return originalstyle
}

function copyStyle(styles, targetEle, rect) {
    holder.style.cssText = ''
    let targetStyles = getComputedStyle(targetEle),
      l = styles.length,
      key;

    while (l--) {
        key = styles[l];
        holder.style[key] = targetStyles[key];
    }
    let paddingTop = 0,
        paddingBottom = 0
    if (targetStyles.display == 'inline') {
        paddingTop = targetStyles.paddingTop.replace("px", "")
        paddingBottom = targetStyles.paddingBottom.replace("px", "")
        paddingTop = parseFloat(paddingTop)
        paddingBottom = parseFloat(paddingBottom)
    }
    setStyle(holder, {
        visiblity: 'hidden',
        width: rect.width + 'px',
        height: rect.height + 'px',
        display: targetStyles.display == 'inline' ? 'inline-block' : targetStyles.display,
        visibility: 'hidden'
    })
    if (targetStyles.display == 'inline') {
        setStyle(holder, {
            height: (rect.height - paddingBottom - paddingTop) + 'px'
        })
    }
    holder.innerHTML = targetEle.innerHTML;
    return holder
}

module.exports = {
    getTransition,
    setStyle,
    copyStyle,
    extendStyle
}
