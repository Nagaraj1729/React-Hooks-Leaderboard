import {useState, useEffect} from 'react'

import Loader from 'react-loader-spinner'

import LeaderboardTable from '../LeaderboardTable'

import {
  LeaderboardContainer,
  LoadingViewContainer,
  ErrorMessage,
} from './styledComponents'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const Leaderboard = () => {
  const [apiResponse, setApiResponse] = useState({
    status: apiStatusConstants.initial,
    data: null,
    errorMsg: null,
  })

  useEffect(() => {
    const getLeaderboardData = async () => {
      setApiResponse(prevResponse => ({
        ...prevResponse,
        status: apiStatusConstants.inProgress,
      }))

      const apiUrl = 'https://apis.ccbp.in/leaderboard'
      const options = {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MjMwNjU1MzJ9.D13s5wN3Oh59aa_qtXMo3Ec4wojOx0EZh8Xr5C5sRkU',
        },
      }

      const response = await fetch(apiUrl, options)
      const responseData = await response.json()

      if (response.ok) {
        setApiResponse(prevResponse => ({
          ...prevResponse,
          status: apiStatusConstants.success,
          data: responseData,
        }))
      } else {
        setApiResponse(prevResponse => ({
          ...prevResponse,
          status: apiStatusConstants.failure,
          errorMsg: responseData.error_msg,
        }))
      }
    }
    getLeaderboardData()
  }, [])

  const renderLoadingView = () => (
    <LoadingViewContainer>
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </LoadingViewContainer>
  )

  const renderFailureView = () => {
    const {errorMsg} = apiResponse
    return <ErrorMessage>{errorMsg}</ErrorMessage>
  }

  const renderSuccessView = () => {
    const {data} = apiResponse
    const formattedData = data.leaderboard_data.map(eachUser => ({
      id: eachUser.id,
      language: eachUser.language,
      name: eachUser.name,
      profileImgUrl: eachUser.profile_image_url,
      rank: eachUser.rank,
      score: eachUser.score,
      timeSpent: eachUser.time_spent,
    }))

    return <LeaderboardTable leaderboardData={formattedData} />
  }

  const renderLeaderboard = () => {
    const {status} = apiResponse
    switch (status) {
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return <LeaderboardContainer>{renderLeaderboard()}</LeaderboardContainer>
}

export default Leaderboard
