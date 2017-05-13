var app = angular.module('app', []);

function matchesSetter(value) {
    var indexSplice = false;
    var length = this.length;
    /** не обновленные матчи следует удалить, т.к. их нет в response массиве */
    value.updated = false;

    for (var i = 0; i < length; i++) {
        if (value.id == this[i].id) {
            value.startTime = this[i].startTime;

            value.coefficient.coefficientOne = this[i].coefficient.coefficientOne;
            value.coefficient.coefficientDraw = this[i].coefficient.coefficientDraw;
            value.coefficient.coefficientTwo = this[i].coefficient.coefficientTwo;

            value.pointOne = this[i].pointOne;
            value.pointTwo = this[i].pointTwo;
            value.express = this[i].express;
            value.cancelled = this[i].cancelled;
            value.completed = this[i].completed;
            value.started = this[i].started;
            value.acceptBets = this[i].acceptBets;
            value.cssStatus = this[i].cssStatus;

            value.subMatch = this[i].subMatch;

            value.updated = true;
            indexSplice = i;
        }
    }

    /**
     * удаляем из response массива матчи которые уже обновились,
     * чтобы затем осавшиеся матчи добавить в scope как новые
     */
    if (indexSplice !== false) {
        this.splice(indexSplice, 1);
    }
}