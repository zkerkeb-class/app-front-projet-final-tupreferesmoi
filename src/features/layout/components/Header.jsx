"use client";

import React from "react";
import styled from "styled-components";
import { Search, Home, Grid, ChevronLeft, ChevronRight, Music } from "react-feather";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserMenu from "../../../components/common/UserMenu";
import { musicApi } from "@/services/musicApi";

const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.md}
        ${({ theme }) => theme.spacing.xl};
    background-color: ${({ theme }) => theme.colors.background};
    position: sticky;
    top: 0;
    z-index: 100;
`;

const NavigationSection = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const NavButton = styled.button`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.7);
    border: none;
    color: ${({ theme }) => theme.colors.text};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: rgba(0, 0, 0, 0.8);
        transform: scale(1.05);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        &:hover {
            transform: none;
        }
    }
`;

const HomeButton = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    color: ${({ theme }) => theme.colors.text};

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const SearchWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    flex-grow: 1;
    max-width: 364px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 500px;
    padding: 6px 12px;
`;

const SearchIcon = styled.div`
    display: flex;
    align-items: center;
    margin-right: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};
`;

const Input = styled.input`
    width: 100%;
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.text};
    font-size: 14px;
    outline: none;

    &::placeholder {
        color: ${({ theme }) => theme.colors.textSecondary};
    }
`;

const SearchResultDiv = styled.div`
    position: absolute;
    max-width: 400px;
    top:50px;
    background-color: #262626;
    

`;
const SearchResultList = styled.ul`

`;

const BrowseButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    width: 32px;
    height: 32px;
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

export default function Header() {
    const router = useRouter();

    function SetSessionStorageValues(){ // pour verifier si la dernière requête date d'il ya plus de 3 secondes
        sessionStorage.setItem("lastRequestTime", 0)
    }
    SetSessionStorageValues();
    
   async function SearchMusic(){
        const searchInput = document.querySelector("#searchInput");
        const minInputValueLengthRequired = 3; // nombre de caractères minimum pour lancer la recherche
        let requestResponse = undefined;

        if(searchInput.value.length == 0){ // Si on vide l'input alors on fait disparaitre la liste
            document.querySelector("#SearchResultList").innerHTML =""; 
            document.querySelector("#SearchResultDiv").style.display = "none" 
            
        } 


        if((searchInput.value.length >= minInputValueLengthRequired) ){ // si on a minimum 3 caractère dans la barre de recherche
            
            // vérifcation de l'heure de la dernière requête vers l'api (minimum 2 secondes) entre chaque appel
            if( parseInt(sessionStorage.getItem("lastRequestTime")) + 3000 < Date.now()){
                
                //lancement de la reqûete
                await musicApi.globalSearch(searchInput.value.trim())
                .then( res => requestResponse = res  )
                
                //console.log(requestResponse);

                //un fois la requête lancé je tag l'heure de cette dernière requête et je renseigne la pécedente valeur recherché
                sessionStorage.setItem("lastRequestTime", parseInt(Date.now()));
                document.querySelector("#SearchResultList").innerHTML =""; // vide la liste pour éviter les resultat en doublons
                generateSearchResultDiv(requestResponse);
                //sessionStorage.setItem("searchInputLastValue", searchInput.value);

            }else{ // on attends arbitrairement 2 secondes avant de lancer le prochain call

                setTimeout(async ()=>{
                    
                    await musicApi.globalSearch(searchInput.value.trim())
                    .then( res => requestResponse = res  );
                    document.querySelector("#SearchResultList").innerHTML =""; // vide la liste pour éviter les resultat en doublons
                    generateSearchResultDiv(requestResponse);


                },2000)                
            }
            
        }           

    }

    function generateSearchResultDiv(requestResult){
        
        console.log(document.querySelector("#SearchResultWrapper"))
        let searchResultList = document.querySelector("#SearchResultList"); //ul
        const listElemTemplate = (type , string, trackId, albumId, artistId )=>{// string = titre /  type = album, track , artist
            return `<li class="searchListElem" 
                        type=${type} 
                        trackId=${trackId} 
                        artistId=${artistId} 
                        albumId=${albumId}>
                        ${string} 
                        <span> (${type})</span>
                    </li>`
        }
        console.log(searchResultList);

        //searchResultList.removeChild(document.querySelectorAll(".searchListElem"));
        

        //console.log(getBoundingClientRect()); //emeplacement de l'element ciblé (ici la navbar)
        if(requestResult.tracks.length > 0 ){
            //console.log("on as des pistes");
            requestResult.tracks.forEach((elem) =>{ // générer une ligne de de menu pour élement chaque tracks trouver
                //console.log(elem);
                searchResultList.insertAdjacentHTML('afterbegin', listElemTemplate("Track" ,elem.title, elem._id, elem.albumId, elem.artistId))
                
            }) 
            
        }
        
        if(requestResult.artists.length > 0 ){

            requestResult.artists.forEach((elem)=> {// générer une ligne de de menu pour élement  chaque artist trouver                
                searchResultList.insertAdjacentHTML('afterbegin', listElemTemplate("Artist", elem.name, undefined, undefined, elem._id))
             })
        }
                                
        
        if(requestResult.albums.length > 0 ){
            requestResult.albums.forEach((elem)=> {   // générer une ligne de de menu pour élement chaque albums trouver
                //console.log(elem.title);
                searchResultList.insertAdjacentHTML('afterbegin', listElemTemplate("Album", elem.title, undefined, elem._id, elem.artistId))
                
            });
            
        }
        
    }
        
    

    return (
        <HeaderContainer>
            <NavigationSection>
                <NavButton onClick={() => router.back()}>
                    <ChevronLeft size={20} />
                </NavButton>
                <NavButton onClick={() => router.forward()}>
                    <ChevronRight size={20} />
                </NavButton>
                <HomeButton href="/">
                    <Home size={24} />
                </HomeButton>
            </NavigationSection>

            <SearchWrapper>
                <SearchIcon>
                    <Search size={20} />
            <SearchResultDiv id="SearchResultWrapper">
                <SearchResultList id="SearchResultList"></SearchResultList>{/*Rempli dynamiquement*/}
            </SearchResultDiv>
                </SearchIcon>
                <Input
                    id="searchInput"
                    type="text"
                    placeholder="Que souhaitez-vous écouter ou regarder ?"
                    onChange={SearchMusic}
                />
            </SearchWrapper>

            <NavigationSection>
                <BrowseButton>
                    <Grid size={24} />
                </BrowseButton>
                <UserMenu />
            </NavigationSection>

        </HeaderContainer>
        
    );
}
