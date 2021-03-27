export default `
const pos : array<vec2<f32>, 3> = array<vec2<f32>, 3>(
  vec2<f32>(0.0, 0.5),
  vec2<f32>(-0.5, -0.5),
  vec2<f32>(0.5, -0.5));

[[location(0)]] var<in> a_pos : vec2<f32>;
[[location(1)]] var<in> a_uv : vec2<f32>;

[[location(0)]] var<out> vUV : vec2<f32>;

[[builtin(position)]] var<out> Position : vec4<f32>;
[[builtin(vertex_index)]] var<in> VertexIndex : i32;



[[stage(vertex)]]
fn main() -> void {
  Position = vec4<f32>(a_pos, 0.0, 1.0);
  vUV = a_uv;
  return;
}
`


