import { useState, useEffect } from "react";
import { 
  HomeContainer, 
  LinkGithub, 
  Post,
  PostsContainer, 
  ProfileContainer, 
  SearchContainer 
} from "./styles";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { apiURL } from "../../lib/axios";

interface TypesProfile {
  name: string
  login: string
  avatar: string
  followers: string
}

interface TypesPosts {
  number: number
  title: string
  body: string
  updated_at: string
}

interface SeachPostData {
  searchPost: string
}
export function Home() {
  const [profile, setProfile] = useState<TypesProfile>()
  const [posts, setPosts] = useState<TypesPosts[]>([]);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<SeachPostData>();

  async function getProfile() {
    const response = await apiURL.get("/users/gsgibbon")

    const data = response.data;

    setProfile({
      name: data.name,
      login: data.login,
      avatar: data.avatar_url,
      followers: data.followers
    })
  }

  async function getIssues() {
   const response = await apiURL.get(`/search/issues?q=repo:gsgibbon/Github-Blog`)

   const dataPost = response.data

   setPosts(dataPost.items)
  }

  useEffect(() => {
    getProfile()
    getIssues()
  }, [])

  function formatDate(date: string) {
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: ptBR
    })
  }

  function handlePostClick(postNumber: number) {
    navigate(`/post/${postNumber}`)
  }

  async function handleSearchPost(data: SeachPostData) {
    const response = await apiURL.get(
      `/search/issues?q=${data.searchPost} repo:gsgibbon/Github-Blog`
    )
    const dataPost = response.data
    
    setPosts(dataPost.items)
    reset({searchPost: ""})
  }
  return(
    <HomeContainer>
      {profile && 
        <ProfileContainer>
          <img src={profile.avatar} alt="" />
          <div>
            <h2>{profile.name}</h2>
            
            <LinkGithub href="https://github.com/gsgibbon">GITHUB</LinkGithub>
            
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minus quidem eligendi, 
              ab officia exercitationem velit quisquam sit placeat. Ipsum enim,
              cum eos ducimus natus facere laboriosam aspernatur! Exercitationem, pariatur tempore.
            </p>

            <ul>
              <li>{profile.login}</li>
              <li>{profile.followers} seguidores</li>
            </ul>
          </div>
        </ProfileContainer>
      }

      <SearchContainer >
        <div>
          <h4>Publicações</h4>  
          <span>{posts.length} publicações</span>
        </div>
        <form onSubmit={handleSubmit(handleSearchPost)}>
          <input 
            type="text" 
            placeholder="Buscar conteúdo"
            {...register("searchPost")} 
          />
        </form>
      </SearchContainer>
  
      <PostsContainer>
        {posts.length > 0 &&   
          posts.map((post) => (
            <Post key={post.number} onClick={() => handlePostClick(post.number)}>
              <div>
                <h3>{post.title}</h3>
                <span>{formatDate(post.updated_at)}</span>
              </div>
              <p>{post.body}</p>
            </Post>
          ))
        }
      </PostsContainer> 
  
    </HomeContainer>
  )
}