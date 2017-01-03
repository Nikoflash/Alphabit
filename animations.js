function animate(animationStart, animationEnd, duration, tweenType, easeType, renderMethod) {
    switch (tweenType) {
    case 'to':
        TweenLite.to(animationStart, duration, {
            value: animationEnd,
            ease: easeType,
            onUpdate: renderMethod,
            onComplete: renderMethod
        });
    }
}




