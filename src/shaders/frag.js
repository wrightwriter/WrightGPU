export default `
[[location(0)]] var<out> fragColor: vec4<f32>;

[[stage(fragment)]]
fn main() -> void {
  fragColor = vec4<f32>(1.0, 1.0, 1.0, 1.0);

  return;
}

`


