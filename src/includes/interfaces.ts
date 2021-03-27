
export interface Texture{
  name: string;
}

export interface Project{
  name: string;
  code: string;
  codeLanguage: string;
  textures: Array<Texture>;
}