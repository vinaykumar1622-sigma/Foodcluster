import React from 'react'
import axios from "axios"
import { useEffect } from 'react'
import { serverUrl } from "../App"
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function useGetMyShop() {
  const dispatch = useDispatch()
 useEffect(()=>{
     const fetchshop = async () => {
  try {
        const result = await axios.get(`${serverUrl}/api/shop/get-my`,{
          withCredentials:true
        })
        dispatch(setMyShopData(result.data))
  } catch (error) {
    console.log(error.response?.data) 
  }}
  fetchshop()
 },[])
}

export default useGetMyShop