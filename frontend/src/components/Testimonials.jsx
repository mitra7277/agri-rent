export default function Testimonials() {
  const data = [
    {
      name: "Rahul Verma",
      role: "Farmer, UP",
      text: "AgriRent se tractor hire karna bohot easy ho gaya. Rates affordable hain aur service fast.",
      img: "https://randomuser.me/api/portraits/men/31.jpg",
      stars: 5,
    },
    {
      name: "Priya Sharma",
      role: "Farm Owner, MP",
      text: "Machine availability check feature is amazing. Last minute booking bhi smooth hoti hai!",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      stars: 5,
    },
    {
      name: "Raghav Singh",
      role: "Operator, Bihar",
      text: "Payments clear, owner dashboard neat and clean. Superb platform!",
      img: "https://randomuser.me/api/portraits/men/52.jpg",
      stars: 4,
    },
    {
      name: "Anjali Patel",
      role: "Farmer, Gujarat",
      text: "Jab bhi zarurat hoti hai, 5 min mein machine mil jati hai. Highly recommended!",
      img: "https://randomuser.me/api/portraits/women/12.jpg",
      stars: 5,
    },
    {
      name: "Suresh Mehta",
      role: "Landlord, Punjab",
      text: "Owner earnings report bohot helpful hai. Transparent aur easy.",
      img: "https://randomuser.me/api/portraits/men/14.jpg",
      stars: 4,
    },
    {
      name: "Neha Kumari",
      role: "Farmer, Jharkhand",
      text: "Interface simple aur quick. Best agriculture rental service!",
      img: "https://randomuser.me/api/portraits/women/24.jpg",
      stars: 5,
    },
    {
      name: "Vijay Pawar",
      role: "Farmer, Maharashtra",
      text: "Support bhi bohot fast hai. Machine breakdown par immediate help mili.",
      img: "https://randomuser.me/api/portraits/men/28.jpg",
      stars: 5,
    },
    {
      name: "Sunita Devi",
      role: "Farmer, Rajasthan",
      text: "App ne mere daily farming tasks easy bana diye. Machine variety bhi kaafi hai!",
      img: "https://randomuser.me/api/portraits/women/22.jpg",
      stars: 4,
    },
    {
      name: "Mohit Mishra",
      role: "Owner, UP",
      text: "Owner panel se pura control mil jata hai. Booking approval system top class!",
      img: "https://randomuser.me/api/portraits/men/45.jpg",
      stars: 5,
    },
    {
      name: "Rekha Yadav",
      role: "Farmer, Haryana",
      text: "Aise platform ki farming sector me bohot need thi. Finally best solution mila!",
      img: "https://randomuser.me/api/portraits/women/16.jpg",
      stars: 5,
    },
  ];

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>What Our Users Say</h2>
      <p style={styles.subtitle}>Trusted by thousands of farmers & machine owners 🚜</p>

      <div style={styles.grid}>
        {data.map((t, i) => (
          <div key={i} style={styles.card}>
            <img src={t.img} alt="user" style={styles.img} />

            <div style={styles.name}>{t.name}</div>
            <div style={styles.role}>{t.role}</div>

            <p style={styles.text}>"{t.text}"</p>

            <div style={styles.stars}>
              {"⭐".repeat(t.stars)}
              {"☆".repeat(5 - t.stars)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    marginTop: 40,
    padding: "20px 30px",
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    marginBottom: 6,
    color: "var(--primary)",
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.7,
    marginBottom: 30,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 20,
  },
  card: {
    background: "var(--card-bg)",
    padding: 18,
    borderRadius: 14,
    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
    transition: "0.3s",
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: "50%",
    marginBottom: 10,
    objectFit: "cover",
  },
  name: {
    fontWeight: 700,
    fontSize: 18,
  },
  role: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 1.4,
    opacity: 0.8,
  },
  stars: {
    marginTop: 10,
    fontSize: 18,
    color: "#facc15",
  },
};
