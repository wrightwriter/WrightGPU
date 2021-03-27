

export default compute = `

  // -- Particle Buffer -- //

  [[block]] struct Particle{
    [[offset(0)]] pos = vec2<f32>;
  }

  [[block]] struct Particles {
    [[offset(0)]] particles : [[stride(16)]] array<Particle, ${numParticles}>;
  };

  [[binding(0), group(0)]] var<storage_buffer> particlesA : Particles;


  // -- Uniforms -- //

  [[block]] struct Uniforms{
    [[offset(0)]] a: f32;
  }

  [[binding(1), group(0)]] var<uniform> banana : Uniforms;


  // -- Main -- //


  [[stage(compute)]]
  fn main() -> void {
    var computeIdx : u32 = GlobalInvocationID.x;
    if (index >= 1500){
      return;
    }

    var vPos : vec2<f32> = vec2<f32>(0.0, 0.0);


  }

`


