import React from 'react';
import {StyleSheet,View,Text} from 'react-native';
import { SafeAreaView } from 'react-native';
import SharedMemory from '../Components/SharedMemory';

const albumsData = [
    {
      id: 1,
      user: 'John Doe',
      userAvatar: 'https://placekitten.com/50/50',
      album: [
        'https://placekitten.com/200/200',
        'https://placekitten.com/201/201',
        'https://placekitten.com/202/202',
      ],
      comments: [
        'Nice album! I really like the variety of photos you have here. Each one tells a different story.Nice album! I really like the variety of photos you have here. Each one tells a different story. ',
        'Love the photos! The composition and colors are amazing.',
        'These photos are inspiring. Makes me want to pick up my camera and go out shooting!',
        'Nice album! I really like the variety of photos you have here. Each one tells a different story.Nice album! I really like the variety of photos you have here. Each one tells a different story. ',
        'Love the photos! The composition and colors are amazing.',
        'These photos are inspiring. Makes me want to pick up my camera and go out shooting!',
        'Nice album! I really like the variety of photos you have here. Each one tells a different story.Nice album! I really like the variety of photos you have here. Each one tells a different story. ',
        'Love the photos! The composition and colors are amazing.',
        'These photos are inspiring. Makes me want to pick up my camera and go out shooting!',
        'Nice album! I really like the variety of photos you have here. Each one tells a different story.Nice album! I really like the variety of photos you have here. Each one tells a different story. ',
        'Love the photos! The composition and colors are amazing.',
        'These photos are inspiring. Makes me want to pick up my camera and go out shooting!',
      ],
      evaluation: 5,
    },
    {
      id: 2,
      user: 'Jane Smith',
      userAvatar: 'https://placekitten.com/51/51',
      album: [
        'https://placekitten.com/203/203',
        'https://placekitten.com/204/204',
        'https://placekitten.com/205/205',
      ],
      comments: [
        'Amazing album! Every photo is a masterpiece.',
        'Great shots! You have a good eye for capturing moments.',
        'These photos tell a story. I can feel the emotions in each shot.',
        'The colors in your photos are so vibrant. It\'s like each photo comes alive!',
      ],
      evaluation: 3,
    },
    {
      id: 3,
      user: 'Alice Johnson',
      userAvatar: 'https://placekitten.com/52/52',
      album: [
        'https://placekitten.com/206/206',
        'https://placekitten.com/207/207',
        'https://placekitten.com/208/208',
      ],
      comments: [
        'Beautiful pictures! Each one is a work of art.',
        'I love your photography style. It\'s so unique and expressive.',
        'These photos make me want to travel. You capture the essence of each place beautifully.',
        'Your photos are like poetry. They speak to the soul.',
        'I can\'t pick a favorite photo because they\'re all so good!',
      ],
      evaluation: 4,
    },
    {
      id: 4,
      user: 'Bob Brown',
      userAvatar: 'https://placekitten.com/53/53',
      album: [
        'https://placekitten.com/209/209',
        'https://placekitten.com/210/210',
        'https://placekitten.com/211/211',
      ],
      comments: [
        'Impressive album! Your photos are top-notch.',
        'Lovely photography. Each photo tells a different story.',
        'The lighting in your photos is perfect. It enhances the mood so well.',
        'You have a talent for capturing candid moments.',
        'Keep up the great work!',
        'Your photos inspire me to explore more with my camera.',
      ],
      evaluation: 4,
    },
    {
      id: 5,
      user: 'Eva Martinez',
      userAvatar: 'https://placekitten.com/54/54',
      album: [
        'https://placekitten.com/212/212',
        'https://placekitten.com/213/213',
        'https://placekitten.com/214/214',
      ],
      comments: [
        'Fantastic album! I\'m blown away by your creativity.',
        'Incredible shots! Each photo tells a different story.',
        'The composition in your photos is perfect. You have a good eye for detail.',
        'I can feel the emotions in your photos. They resonate with me.',
        'Your photos take me on a journey. Thank you for sharing them!',
      ],
      evaluation: 5,
    },
  ];

const SharedMemoryScreen=()=>{
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <SharedMemory albums={albumsData} />
      </SafeAreaView>
    )
}

const Styles=StyleSheet.create({
    
})

export default SharedMemoryScreen;