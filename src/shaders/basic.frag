precision mediump float;

uniform sampler2D tileTexture;

varying vec2 vUv;

void main() {

	gl_FragColor = texture2D(tileTexture, vUv);

}