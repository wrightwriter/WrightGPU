export default `
//[[location(0)]] var<in> fragColor : vec4<f32>;
[[location(0)]] var<out> outColor: vec4<f32>;
[[location(0)]] var<in> vUV : vec2<f32>;

[[stage(fragment)]]
fn main() -> void {

  outColor = vec4<f32>(1.0, 0.0, .3, 1.0);
  outColor[0] = vUV[0];

  //outColor = fragColor;
  return;
}

`


 