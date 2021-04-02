attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;

void main() {
  vUv = uv;
	gl_Position = vec4(vec3(position.x, position.y, 1.0), 1.0);
}