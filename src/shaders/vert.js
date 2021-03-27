export default vert = `
[[location(0)]] var<in> a_particlePos : vec2<f32>;
[[location(1)]] var<in> a_particleVel : vec2<f32>;
[[location(2)]] var<in> a_pos : vec2<f32>;

[[builtin(position)]] var<out> Position : vec4<f32>;

[[stage(vertex)]]
fn main() -> void {
  var angle : f32 = -atan2(a_particleVel.x, a_particleVel.y);
  var pos : vec2<f32> = vec2<f32>(
      (a_pos.x * cos(angle)) - (a_pos.y * sin(angle)),
      (a_pos.x * sin(angle)) + (a_pos.y * cos(angle)));
  Position = vec4<f32>(pos + a_particlePos, 0.0, 1.0);
  return;
}

`


