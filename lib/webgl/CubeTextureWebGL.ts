import {ByteArray} from "@awayjs/core";

import {ImageCube} from "@awayjs/graphics";

import {ICubeTexture} from "../base/ICubeTexture";

import {TextureBaseWebGL} from "./TextureBaseWebGL";

export class CubeTextureWebGL extends TextureBaseWebGL implements ICubeTexture
{

	private _textureSelectorDictionary:Array<number> = new Array<number>(6);

	public textureType:string = "textureCube";
	private _size:number;

	constructor(gl:WebGLRenderingContext, size:number)
	{
		super(gl);
		this._size = size;
		this._glTexture = this._gl.createTexture();

		this._textureSelectorDictionary[0] = gl.TEXTURE_CUBE_MAP_POSITIVE_X;
		this._textureSelectorDictionary[1] = gl.TEXTURE_CUBE_MAP_NEGATIVE_X;
		this._textureSelectorDictionary[2] = gl.TEXTURE_CUBE_MAP_POSITIVE_Y;
		this._textureSelectorDictionary[3] = gl.TEXTURE_CUBE_MAP_NEGATIVE_Y;
		this._textureSelectorDictionary[4] = gl.TEXTURE_CUBE_MAP_POSITIVE_Z;
		this._textureSelectorDictionary[5] = gl.TEXTURE_CUBE_MAP_NEGATIVE_Z;
	}

	public uploadFromImage(imageCube:ImageCube, side:number, miplevel:number = 0):void
	{
		this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, this._glTexture);
		this._gl.texImage2D(this._textureSelectorDictionary[side], miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, imageCube.getImageData(side));
		this._gl.bindTexture(this._gl.TEXTURE_CUBE_MAP, null);
	}

	public uploadCompressedTextureFromByteArray(data:ByteArray, byteArrayOffset:number /*uint*/, async:boolean = false):void
	{

	}

	public get size():number
	{
		return this._size;
	}

	public generateMipmaps():void
	{
		this._gl.bindTexture( this._gl.TEXTURE_CUBE_MAP, this._glTexture );
		this._gl.generateMipmap(this._gl.TEXTURE_CUBE_MAP);
		//this._gl.bindTexture( this._gl.TEXTURE_CUBE_MAP, null );
	}
}