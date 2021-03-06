import {AssetEvent} from "@awayjs/core";

import {BitmapImageCube, BitmapImage2D, MipmapGenerator} from "@awayjs/graphics";

import {ICubeTexture} from "../base/ICubeTexture";
import {GL_ImageCube} from "../image/GL_ImageCube";

/**
 *
 * @class away.pool.ImageObjectBase
 */
export class GL_BitmapImageCube extends GL_ImageCube
{
	public _mipmapDataArray:Array<Array<BitmapImage2D>> = new Array<Array<BitmapImage2D>>(6);

	public activate(index:number, mipmap:boolean):void
	{
		if (mipmap && this._stage.globalDisableMipmap)
			mipmap = false;
		
		if (!this._texture) {
			this._createTexture();
			this._invalid = true;
		}

		if (!this._mipmap && mipmap) {
			this._mipmap = true;
			this._invalid = true;
		}

		if (this._invalid) {
			this._invalid = false;

			for (var i:number = 0; i < 6; ++i)
				(<ICubeTexture> this._texture).uploadFromImage(<BitmapImageCube> this._asset, i, 0);

			if (mipmap) //todo: allow for non-generated mipmaps
				this._texture.generateMipmaps();
		}

		// if (this._invalid) {
		// 	this._invalid = false;
		// 	for (var i:number = 0; i < 6; ++i) {
		// 		if (mipmap) {
		// 			var mipmapData:Array<BitmapImage2D> = this._mipmapDataArray[i] || (this._mipmapDataArray[i] = new Array<BitmapImage2D>());
		//
		// 			MipmapGenerator._generateMipMaps((<BitmapImageCube> this._asset).getCanvas(i), mipmapData, true);
		// 			var len:number = mipmapData.length;
		// 			for (var j:number = 0; j < len; j++)
		// 				(<ICubeTexture> this._texture).uploadFromImage(mipmapData[j], i, j);
		// 		} else {
		// 			(<ICubeTexture> this._texture).uploadFromImage(<BitmapImageCube> this._asset, i, 0);
		// 		}
		// 	}
		// }

		super.activate(index, mipmap);
	}

	/**
	 *
	 */
	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		for (var i:number = 0; i < 6; i++) {
			var mipmapData:Array<BitmapImage2D> = this._mipmapDataArray[i];

			if (mipmapData) {
				var len:number = mipmapData.length;

				for (var j:number = 0; j < len; i++)
					MipmapGenerator._freeMipMapHolder(mipmapData[j]);
			}
		}
	}
}