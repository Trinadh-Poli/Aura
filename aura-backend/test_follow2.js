const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:8082/api/users/login', {
      email: 'trinadhpoli@gmail.com',
      password: 'password123'
    });
    const token = loginRes.data.token;
    console.log("Token:", token.substring(0, 20) + "...");

    // Test follow
    const followRes = await axios.post('http://localhost:8082/api/follow/artist/2', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Follow response:", followRes.data);

    // Test check
    const checkRes = await axios.get('http://localhost:8082/api/follow/artist/2/check', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Check response:", checkRes.data);

    // Test following list
    const userRes = await axios.get('http://localhost:8082/api/users/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const followingList = await axios.get(`http://localhost:8082/api/follow/following/${userRes.data.id}`);
    console.log("Following list:", followingList.data.map(f => f.username));

  } catch (err) {
    if (err.response) {
      console.error("Error response:", err.response.data);
    } else {
      console.error(err);
    }
  }
}

test();
