import { Tabs, usePathname} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const pathname = usePathname();
  const hideTab =
    pathname.startsWith('/auth');

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "#999",
        headerShown: false,
        tabBarStyle: hideTab ? { display: 'none' } : undefined,
      })}
    >
       <Tabs.Screen 
            name="dashboard/homePage" 
            options={{ 
                title: 'Home', 
                tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
            }} 
        />
        <Tabs.Screen
          name="library/index"
          options={{
            title: 'Library',
            tabBarIcon: ({ color }) => <Ionicons size={28} name="book" color={color} />,
          }}
        />

       <Tabs.Screen name="auth/index" options={{href: null,}}/>
       <Tabs.Screen name="dahsboard/homePage" options={{href: null,}}/>
       <Tabs.Screen name="auth/registerPage" options={{href: null,}}/>
       <Tabs.Screen name="auth/newPassword" options={{href: null,}}/>
       <Tabs.Screen name="content/level" options={{href: null,}}/>
       <Tabs.Screen name="content/materi" options={{href: null,}}/>
       <Tabs.Screen name="content/sub_materi" options={{href: null,}}/>
       <Tabs.Screen name="content/quiz" options={{href: null,}}/>
       <Tabs.Screen name="content/result" options={{href: null,}}/>
       <Tabs.Screen name="content/isi_materi" options={{href: null,}}/>

       {/* <Tabs.Screen name="component/gridItem" options={{href: null}}/> */}


      {/* <Tabs.Screen name="profile" options={{ title: 'Profile' }} /> */}
    </Tabs>
  );
}
