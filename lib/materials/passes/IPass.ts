import {IEventDispatcher, Matrix3D, ProjectionBase} from "@awayjs/core";

import {TextureBase, Style} from "@awayjs/graphics";

import {GL_RenderableBase} from "../../renderables/GL_RenderableBase";
import {AnimationSetBase} from "../../animators/AnimationSetBase";
import {GL_SamplerBase} from "../../image/GL_SamplerBase";
import {GL_ImageBase} from "../../image/GL_ImageBase";
import {GL_MaterialBase} from "../../materials/GL_MaterialBase";
import {ShaderBase} from "../../shaders/ShaderBase";
import {ShaderRegisterCache} from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterData} from "../../shaders/ShaderRegisterData";

/**
 *
 * @class away.pool.Passes
 */
export interface IPass extends IEventDispatcher
{
	shader:ShaderBase;

	images:Array<GL_ImageBase>;

	samplers:Array<GL_SamplerBase>;

	style:Style;

	animationSet:AnimationSetBase;
	
	_includeDependencies(shader:ShaderBase);

	_initConstantData(shader:ShaderBase);

	_getVertexCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_getFragmentCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_getPostAnimationFragmentCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_getNormalVertexCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_getNormalFragmentCode(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;


	/**
	 * Sets the material state for the pass that is independent of the rendered object. This needs to be called before
	 * calling pass. Before activating a pass, the previously used pass needs to be deactivated.
	 * @param stage The Stage object which is currently used for rendering.
	 * @param camera The camera from which the scene is viewed.
	 * @private
	 */
	_activate(projection:ProjectionBase);

	_setRenderState(renderable:GL_RenderableBase, projection:ProjectionBase)

	/**
	 * Clears the surface state for the pass. This needs to be called before activating another pass.
	 * @param stage The Stage used for rendering
	 *
	 * @private
	 */
	_deactivate();

	invalidate();

	dispose();

	getImageIndex(texture:TextureBase, index?:number):number;
}