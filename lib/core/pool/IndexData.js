/**
 *
 */
var IndexData = (function () {
    function IndexData(level) {
        this._dataDirty = true;
        this.invalid = new Array(8);
        this.contexts = new Array(8);
        this.buffers = new Array(8);
        this.level = level;
    }
    IndexData.prototype.updateData = function (offset, indices, numVertices) {
        if (this._dataDirty) {
            this._dataDirty = false;
            if (indices.length < IndexData.LIMIT_INDICES && numVertices < IndexData.LIMIT_VERTS) {
                //shortcut for those buffers that fit into the maximum buffer sizes
                this.indexMappings = null;
                this.originalIndices = null;
                this.setData(indices);
                this.offset = indices.length;
            }
            else {
                var i;
                var len;
                var outIndex;
                var j;
                var k;
                var splitIndices = new Array();
                this.indexMappings = new Array(indices.length);
                this.originalIndices = new Array();
                i = this.indexMappings.length;
                while (i--)
                    this.indexMappings[i] = -1;
                var originalIndex;
                var splitIndex;
                // Loop over all triangles
                outIndex = 0;
                len = indices.length;
                i = offset;
                k = 0;
                while (i < len && outIndex + 3 < IndexData.LIMIT_INDICES && k + 3 < IndexData.LIMIT_VERTS) {
                    for (j = 0; j < 3; j++) {
                        originalIndex = indices[i + j];
                        if (this.indexMappings[originalIndex] >= 0) {
                            splitIndex = this.indexMappings[originalIndex];
                        }
                        else {
                            // This vertex does not yet exist in the split list and
                            // needs to be copied from the long list.
                            splitIndex = k++;
                            this.indexMappings[originalIndex] = splitIndex;
                            this.originalIndices.push(originalIndex);
                        }
                        // Store new index, which may have come from the mapping look-up,
                        // or from copying a new set of vertex data from the original vector
                        splitIndices[outIndex + j] = splitIndex;
                    }
                    outIndex += 3;
                    i += 3;
                }
                this.setData(splitIndices);
                this.offset = i;
            }
        }
    };
    IndexData.prototype.invalidateData = function () {
        this._dataDirty = true;
    };
    IndexData.prototype.dispose = function () {
        for (var i = 0; i < 8; ++i) {
            if (this.contexts[i]) {
                this.contexts[i].disposeIndexData(this);
                this.contexts[i] = null;
            }
        }
    };
    /**
     * @private
     */
    IndexData.prototype.disposeBuffers = function () {
        for (var i = 0; i < 8; ++i) {
            if (this.buffers[i]) {
                this.buffers[i].dispose();
                this.buffers[i] = null;
            }
        }
    };
    /**
     * @private
     */
    IndexData.prototype.invalidateBuffers = function () {
        for (var i = 0; i < 8; ++i)
            this.invalid[i] = true;
    };
    /**
     *
     * @param data
     * @private
     */
    IndexData.prototype.setData = function (data) {
        if (this.data && this.data.length != data.length)
            this.disposeBuffers();
        else
            this.invalidateBuffers();
        this.data = data;
    };
    IndexData.LIMIT_VERTS = 0xffff;
    IndexData.LIMIT_INDICES = 0xffffff;
    return IndexData;
})();
module.exports = IndexData;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvcG9vbC9pbmRleGRhdGEudHMiXSwibmFtZXMiOlsiSW5kZXhEYXRhIiwiSW5kZXhEYXRhLmNvbnN0cnVjdG9yIiwiSW5kZXhEYXRhLnVwZGF0ZURhdGEiLCJJbmRleERhdGEuaW52YWxpZGF0ZURhdGEiLCJJbmRleERhdGEuZGlzcG9zZSIsIkluZGV4RGF0YS5kaXNwb3NlQnVmZmVycyIsIkluZGV4RGF0YS5pbnZhbGlkYXRlQnVmZmVycyIsIkluZGV4RGF0YS5zZXREYXRhIl0sIm1hcHBpbmdzIjoiQUFLQSxBQUdBOztHQURHO0lBQ0csU0FBUztJQXdCZEEsU0F4QktBLFNBQVNBLENBd0JGQSxLQUFZQTtRQWxCaEJDLGVBQVVBLEdBQUdBLElBQUlBLENBQUNBO1FBRW5CQSxZQUFPQSxHQUFrQkEsSUFBSUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFFdENBLGFBQVFBLEdBQXdCQSxJQUFJQSxLQUFLQSxDQUFnQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFFNURBLFlBQU9BLEdBQXVCQSxJQUFJQSxLQUFLQSxDQUFlQSxDQUFDQSxDQUFDQSxDQUFDQTtRQWMvREEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7SUFDcEJBLENBQUNBO0lBRU1ELDhCQUFVQSxHQUFqQkEsVUFBa0JBLE1BQWFBLEVBQUVBLE9BQXFCQSxFQUFFQSxXQUFrQkE7UUFFekVFLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO1lBQ3JCQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUV4QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsR0FBR0EsU0FBU0EsQ0FBQ0EsYUFBYUEsSUFBSUEsV0FBV0EsR0FBR0EsU0FBU0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3JGQSxBQUNBQSxtRUFEbUVBO2dCQUNuRUEsSUFBSUEsQ0FBQ0EsYUFB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R0FBR0EsSUFBSUEsQ0FBQ0E7WUFDeEJBLENBQUNBO1FBQ0ZBLENBQUNBO0lBQ0ZBLENBQUNBO0lBRURMOztPQUVHQTtJQUNLQSxxQ0FBaUJBLEdBQXpCQTtRQUVDTSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUNoQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0E7SUFDekJBLENBQUNBO0lBRUROOzs7O09BSUdBO0lBQ0tBLDJCQUFPQSxHQUFmQSxVQUFnQkEsSUFBa0JBO1FBRWpDTyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxJQUFJQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxJQUFJQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUNoREEsSUFBSUEsQ0FBQ0EsY0FBY0EsRUFBRUEsQ0FBQ0E7UUFDdkJBLElBQUlBO1lBQ0hBLElBQUlBLENBQUNBLGlCQUFpQkEsRUFBRUEsQ0FBQ0E7UUFFMUJBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO0lBQ2xCQSxDQUFDQTtJQWhKY1AscUJBQVdBLEdBQVVBLE1BQU1BLENBQUNBO0lBRTVCQSx1QkFBYUEsR0FBVUEsUUFBUUEsQ0FBQ0E7SUErSWhEQSxnQkFBQ0E7QUFBREEsQ0FuSkEsQUFtSkNBLElBQUE7QUFFRCxBQUFtQixpQkFBVixTQUFTLENBQUMiLCJmaWxlIjoiY29yZS9wb29sL0luZGV4RGF0YS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvcm9iYmF0ZW1hbi9XZWJzdG9ybVByb2plY3RzL2F3YXlqcy1zdGFnZWdsLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdWJHZW9tZXRyeUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2Jhc2UvU3ViR2VvbWV0cnlCYXNlXCIpO1xuXG5pbXBvcnQgQ29udGV4dEdMQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2NvcmUvc3RhZ2VnbC9Db250ZXh0R0xCYXNlXCIpO1xuaW1wb3J0IElJbmRleEJ1ZmZlclx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvY29yZS9zdGFnZWdsL0lJbmRleEJ1ZmZlclwiKTtcblxuLyoqXG4gKlxuICovXG5jbGFzcyBJbmRleERhdGFcbntcblx0cHJpdmF0ZSBzdGF0aWMgTElNSVRfVkVSVFM6bnVtYmVyID0gMHhmZmZmO1xuXG5cdHByaXZhdGUgc3RhdGljIExJTUlUX0lORElDRVM6bnVtYmVyID0gMHhmZmZmZmY7XG5cblx0cHJpdmF0ZSBfZGF0YURpcnR5ID0gdHJ1ZTtcblxuXHRwdWJsaWMgaW52YWxpZDpBcnJheTxib29sZWFuPiA9IG5ldyBBcnJheSg4KTtcblxuXHRwdWJsaWMgY29udGV4dHM6QXJyYXk8Q29udGV4dEdMQmFzZT4gPSBuZXcgQXJyYXk8Q29udGV4dEdMQmFzZT4oOCk7XG5cblx0cHVibGljIGJ1ZmZlcnM6QXJyYXk8SUluZGV4QnVmZmVyPiA9IG5ldyBBcnJheTxJSW5kZXhCdWZmZXI+KDgpO1xuXG5cdHB1YmxpYyBkYXRhOkFycmF5PG51bWJlcj47XG5cblx0cHVibGljIGluZGV4TWFwcGluZ3M6QXJyYXk8bnVtYmVyPjtcblxuXHRwdWJsaWMgb3JpZ2luYWxJbmRpY2VzOkFycmF5PG51bWJlcj47XG5cblx0cHVibGljIG9mZnNldDpudW1iZXI7XG5cblx0cHVibGljIGxldmVsOm51bWJlcjtcblxuXHRjb25zdHJ1Y3RvcihsZXZlbDpudW1iZXIpXG5cdHtcblx0XHR0aGlzLmxldmVsID0gbGV2ZWw7XG5cdH1cblxuXHRwdWJsaWMgdXBkYXRlRGF0YShvZmZzZXQ6bnVtYmVyLCBpbmRpY2VzOkFycmF5PG51bWJlcj4sIG51bVZlcnRpY2VzOm51bWJlcilcblx0e1xuXHRcdGlmICh0aGlzLl9kYXRhRGlydHkpIHtcblx0XHRcdHRoaXMuX2RhdGFEaXJ0eSA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoaW5kaWNlcy5sZW5ndGggPCBJbmRleERhdGEuTElNSVRfSU5ESUNFUyAmJiBudW1WZXJ0aWNlcyA8IEluZGV4RGF0YS5MSU1JVF9WRVJUUykge1xuXHRcdFx0XHQvL3Nob3J0Y3V0IGZvciB0aG9zZSBidWZmZXJzIHRoYXQgZml0IGludG8gdGhlIG1heGltdW0gYnVmZmVyIHNpemVzXG5cdFx0XHRcdHRoaXMuaW5kZXhNYXBwaW5ncyA9IG51bGw7XG5cdFx0XHRcdHRoaXMub3JpZ2luYWxJbmRpY2VzID0gbnVsbDtcblx0XHRcdFx0dGhpcy5zZXREYXRhKGluZGljZXMpO1xuXHRcdFx0XHR0aGlzLm9mZnNldCA9IGluZGljZXMubGVuZ3RoO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIGk6bnVtYmVyO1xuXHRcdFx0XHR2YXIgbGVuOm51bWJlcjtcblx0XHRcdFx0dmFyIG91dEluZGV4Om51bWJlcjtcblx0XHRcdFx0dmFyIGo6bnVtYmVyO1xuXHRcdFx0XHR2YXIgazpudW1iZXI7XG5cdFx0XHRcdHZhciBzcGxpdEluZGljZXM6QXJyYXk8bnVtYmVyPiA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cblx0XHRcdFx0dGhpcy5pbmRleE1hcHBpbmdzID0gbmV3IEFycmF5PG51bWJlcj4oaW5kaWNlcy5sZW5ndGgpO1xuXHRcdFx0XHR0aGlzLm9yaWdpbmFsSW5kaWNlcyA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cblx0XHRcdFx0aSA9IHRoaXMuaW5kZXhNYXBwaW5ncy5sZW5ndGg7XG5cblx0XHRcdFx0d2hpbGUgKGktLSlcblx0XHRcdFx0XHR0aGlzLmluZGV4TWFwcGluZ3NbaV0gPSAtMTtcblxuXHRcdFx0XHR2YXIgb3JpZ2luYWxJbmRleDpudW1iZXI7XG5cdFx0XHRcdHZhciBzcGxpdEluZGV4Om51bWJlcjtcblxuXHRcdFx0XHQvLyBMb29wIG92ZXIgYWxsIHRyaWFuZ2xlc1xuXHRcdFx0XHRvdXRJbmRleCA9IDA7XG5cdFx0XHRcdGxlbiA9IGluZGljZXMubGVuZ3RoO1xuXHRcdFx0XHRpID0gb2Zmc2V0O1xuXHRcdFx0XHRrID0gMDtcblx0XHRcdFx0d2hpbGUgKGkgPCBsZW4gJiYgb3V0SW5kZXggKyAzIDwgSW5kZXhEYXRhLkxJTUlUX0lORElDRVMgJiYgayArIDMgPCBJbmRleERhdGEuTElNSVRfVkVSVFMpIHtcblx0XHRcdFx0XHQvLyBMb29wIG92ZXIgYWxsIHZlcnRpY2VzIGluIGEgdHJpYW5nbGUgLy9UT0RPIGVuc3VyZSB0aGlzIHdvcmtzIGZvciBzZWdtZW50cyBvciBhbnkgZ3JvdXBpbmdcblx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgMzsgaisrKSB7XG5cblx0XHRcdFx0XHRcdG9yaWdpbmFsSW5kZXggPSBpbmRpY2VzW2kgKyBqXTtcblxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuaW5kZXhNYXBwaW5nc1tvcmlnaW5hbEluZGV4XSA+PSAwKSB7XG5cdFx0XHRcdFx0XHRcdHNwbGl0SW5kZXggPSB0aGlzLmluZGV4TWFwcGluZ3Nbb3JpZ2luYWxJbmRleF07XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFRoaXMgdmVydGV4IGRvZXMgbm90IHlldCBleGlzdCBpbiB0aGUgc3BsaXQgbGlzdCBhbmRcblx0XHRcdFx0XHRcdFx0Ly8gbmVlZHMgdG8gYmUgY29waWVkIGZyb20gdGhlIGxvbmcgbGlzdC5cblx0XHRcdFx0XHRcdFx0c3BsaXRJbmRleCA9IGsrKztcblx0XHRcdFx0XHRcdFx0dGhpcy5pbmRleE1hcHBpbmdzW29yaWdpbmFsSW5kZXhdID0gc3BsaXRJbmRleDtcblx0XHRcdFx0XHRcdFx0dGhpcy5vcmlnaW5hbEluZGljZXMucHVzaChvcmlnaW5hbEluZGV4KTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gU3RvcmUgbmV3IGluZGV4LCB3aGljaCBtYXkgaGF2ZSBjb21lIGZyb20gdGhlIG1hcHBpbmcgbG9vay11cCxcblx0XHRcdFx0XHRcdC8vIG9yIGZyb20gY29weWluZyBhIG5ldyBzZXQgb2YgdmVydGV4IGRhdGEgZnJvbSB0aGUgb3JpZ2luYWwgdmVjdG9yXG5cdFx0XHRcdFx0XHRzcGxpdEluZGljZXNbb3V0SW5kZXggKyBqXSA9IHNwbGl0SW5kZXg7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0b3V0SW5kZXggKz0gMztcblx0XHRcdFx0XHRpICs9IDNcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMuc2V0RGF0YShzcGxpdEluZGljZXMpO1xuXHRcdFx0XHR0aGlzLm9mZnNldCA9IGk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIGludmFsaWRhdGVEYXRhKClcblx0e1xuXHRcdHRoaXMuX2RhdGFEaXJ0eSA9IHRydWU7XG5cdH1cblxuXHRwdWJsaWMgZGlzcG9zZSgpXG5cdHtcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCA4OyArK2kpIHtcblx0XHRcdGlmICh0aGlzLmNvbnRleHRzW2ldKSB7XG5cdFx0XHRcdHRoaXMuY29udGV4dHNbaV0uZGlzcG9zZUluZGV4RGF0YSh0aGlzKTtcblx0XHRcdFx0dGhpcy5jb250ZXh0c1tpXSA9IG51bGxcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgZGlzcG9zZUJ1ZmZlcnMoKVxuXHR7XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgODsgKytpKSB7XG5cdFx0XHRpZiAodGhpcy5idWZmZXJzW2ldKSB7XG5cdFx0XHRcdHRoaXMuYnVmZmVyc1tpXS5kaXNwb3NlKCk7XG5cdFx0XHRcdHRoaXMuYnVmZmVyc1tpXSA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwcml2YXRlIGludmFsaWRhdGVCdWZmZXJzKClcblx0e1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IDg7ICsraSlcblx0XHRcdHRoaXMuaW52YWxpZFtpXSA9IHRydWU7XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIGRhdGFcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgc2V0RGF0YShkYXRhOkFycmF5PG51bWJlcj4pXG5cdHtcblx0XHRpZiAodGhpcy5kYXRhICYmIHRoaXMuZGF0YS5sZW5ndGggIT0gZGF0YS5sZW5ndGgpXG5cdFx0XHR0aGlzLmRpc3Bvc2VCdWZmZXJzKCk7XG5cdFx0ZWxzZVxuXHRcdFx0dGhpcy5pbnZhbGlkYXRlQnVmZmVycygpO1xuXG5cdFx0dGhpcy5kYXRhID0gZGF0YTtcblx0fVxufVxuXG5leHBvcnQgPSBJbmRleERhdGE7Il19