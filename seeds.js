var mongoose = require("mongoose");
var FoodItem = require("./models/foodItem");

var data = [
    {
     title: "Red Paneer Chilly Dry",
        category: "starters",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/nubodkbsmzmvg3ud2jxv",
        cost: 269,
        desc: "Paneer Garlic Ginger Chilly Onion Capsicum Tossing With Schezwan Sauce",
        isVeg: true,
    },
    {
        title: "Paneer Chilli Dry",
        category: "starters",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/i9z0ydh86tdfxcpvqtck",
        cost: 219,
        desc: "Chilly paneer is indo Chinese starter or Appetizer garlic",
        isVeg: true,
    },
    {
        title: "Panner Manchurain Dry",
        category: "starters",
        image: "https://b.zmtcdn.com/data/dish_photos/329/63258ee0e6ec02f2bdb6ac8223cc2329.jpg?output-format=webp&fit=around|130:130&crop=130:130;*,*",
        cost: 225,
        desc: "Soft paneer made by roughly chopping and deep-frying mix vegetables and then sauteeing it in a sauce flavored with soya sauce.",
        isVeg: true,
    },
    
    {
        title: "Chicken Tikka",
        category: "starters",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/s8mmxwtwn676dhgmkruc",
        cost: 244,
        desc: "Chicken Cubes Marinated in a seasonal yogurt based marinade Skewered and char grilled serve green chutney & Salad.",
        isVeg: false,
    },
    {
        title: "Chicken Sekh Kebab",
        category: "starters",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/tlfoqywz8m9iqqol9inn",
        cost: 299,
        desc: "Chicken Mince Marinated in a mix of ground Spice Powder Roasted Gram Flour Green Chilly Garlic Ginger Skewered and Grilled Serve with green chutney & salad.",
        isVeg: false,
    },
    {
        title: "Veg Chilli Dry",
        category: "starters",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/n4whnhexzvoodp2ux1vg",
        cost: 195,
        desc: "",
        isVeg: true,
    },
    {
        title: "Veg Crispy",
        category: "starters",
        image: "http://www.sanjeevkapoor.com/UploadFiles/RecipeImages/Veg-Crispy.jpg",
        cost: 230,
        desc: "Generously stuffed, succulent momo fried to perfection topped with creamy sauces served with a dip.",
        isVeg: true,
    },
    {
        title: "Paneer Crispy",
        category: "starters",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/hflfzkjzjhmrjhpebeyf",
        cost: 250,
        desc: "Paneer based Chinese starter, cooked in spices of garlic and ginger with chilly. It is one of our bestsellers.",
        isVeg: true,
    },
    {
        title: "Veg Spring Roll",
        category: "starters",
        image: "https://i2.wp.com/vegecravings.com/wp-content/uploads/2016/09/spring-roll-recipe-step-by-step-instructions.jpg?fit=3766%2C3024&quality=65&strip=all&ssl=1",
        cost: 230,
        desc: "Veg Spring Rolls are crispy deep fried snacks filled with a delicious stuffing of lightly spiced and crunchy vegetables.",
        isVeg: true,
    },
    {
        title: "Veg Manchurian Dry",
        category: "starters",
        image: "http://www.theterracekitchen.in/wp-content/uploads/2019/08/089.-Veg-Manchurian-1.png",
        cost: 215,
        desc: "This dish is prepared by deep frying vegetables balls and by tossing them in the spicy, sweet, tangy Manchurian sauce.",
        isVeg: false,
    },
    //Sandwichesss==================
    {
        title: "Veg Sandwich",
        category: "sandwich",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/qoygpxgudiaeumu07y1p",
        cost: 70,
        desc : "",
        isVeg: true,
    },
    
    {
        title: "Veg Toast Sandwich",
        category: "sandwich",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/vd7gewnj1rqthbipasqb",
        cost: 80,
        desc : "",
        isVeg: true,
    },
    {
        title: "Jain Toast Sandwich",
        category: "sandwich",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/vd7gewnj1rqthbipasqb",
        cost: 90,
        desc : "",
        isVeg: true,
    },
    {
        title: "Veg Grilled Sandwich",
        category: "sandwich",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/jak8xue74uia7nw5xcrl",
        cost: 150,
        desc : "Onion, tomato, capsicum, potato with green sauce",
        isVeg: true,
    },
    {
        title: "Veg Cheese Grilled Sandwich",
        category: "sandwich",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/wi2zt2t5ma9v2alwxpde",
        cost: 150,
        desc : "Onion, tomato, capsicum, potato with green sauce loaded with cheese",
        isVeg: true,
    },
    {
        title: "Pasta Hot Dog Sandwich",
        category: "sandwich",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/tat9umb6fevwb5c3ovzv",
        cost: 210,
        desc : "Macaroni pasta oven baked.",
        isVeg: true,
    },
    {
        title: "Veg Cheese Grilled Sandwich",
        category: "sandwich",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/vd7gewnj1rqthbipasqb",
        cost: 180,
        desc : "Hearty sandwich stuffed generously with assorted seasoned vegetables, cheese and grilled.",
        isVeg: true,
    },
    {
        title: "Melting Sandwich",
        category: "sandwich",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/evex5eqdanqthwarhzay",
        cost: 220,
        desc : "Light space pan fried golden cheese along with bechamel sauce.",
        isVeg: true,
    },
    {
        title: "Italian Sandwich",
        category: "sandwich",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/cgpvlcx5b8fifj6yc1x6",
        cost: 190,
        desc : "Black olive, bell pepper, and corn.",
        isVeg: true,
    },
    {
        title: "Paneer Grilled Sandwich",
        category: "sandwich",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/wzfq7djolqxgdhghebbq",
        cost: 225,
        desc : "Panfried masala paneer.",
        isVeg: true,
    },
    {
        title: "American Club Sandwich",
        category: "sandwich",
        image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2013/2/13/0/FN_FNK-Veggie-Lovers-Club-Sandwich_s4x3.jpg.rend.hgtvcom.616.462.suffix/1371614457375.jpeg",
        cost: 290,
        desc : "Cottage cheese, mayo, and corn coleslaw salad.",
        isVeg: true,
    },
    //P&P==================
    {
        title: "All Veggies Pizza (Served with Seasoning)",
        category: "Italian",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/m1rjcmaj1glqaktgoizx",
        cost: 290,
        desc : "All mix of veggies with olive jalapeno cheese.",
        isVeg: true,
    },
    {
        title: "Greeks Pizza",
        category: "Italian",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/bb3nozbt5unxawhd4tyx",
        cost: 250,
        desc : "Cheese and garlic tomato with tomato sauce.",
        isVeg: true,
    },
    {
        title: "Exotica Pizza",
        category: "Italian",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/afxqbzk9aqbnhbbwcaig",
        cost: 250,
        desc : "Scrumptious pizza filled with exotic vegetables, topped with eons of cheese",
        isVeg: true,
    },
    {
        title: "Pasta In Pink Sauce",
        category: "Italian",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/igvbhbbhywairxnqy1gr",
        cost: 325,
        desc : "A super delicious dish prepared by tossing Penne pasta in three types of sauce.",
        isVeg: true,
    },
    {
        title: "Penne Arrabbiata (Red Sauce)",
        category: "Italian",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/vthxkjhdp5obgpkakogm",
        cost: 290,
        desc : "Penne pasta cooked in spicy tomato sauce flavoured with oregano and basil.",
        isVeg: true,
    },
    {
        title: "Pasta In White Sauce",
        category: "Italian",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/gr4mlql9uiahvca2mdr1",
        cost: 325,
        desc : "Saucy, pantossed Penne pasta in creamy white sauce.",
        isVeg: true,
    },
    {
        title: "Carbonara Pasta",
        category: "Italian",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/ea76m71wtynnilxrhtoi",
        cost: 340,
        desc : "Ovenbaked mixed vegetables in cheesy Penne pasta sauce.",
        isVeg: true,
    },
    //Pav Bhaji==================
    {
        title: "Pav Bhaji",
        category: "PavBhaji",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/iliseyqi8w9sadhesvog",
        cost: 130,
        desc : "An all time favorite combo of pav bhaji, with a striking red bhaji made with Indian spices and assorted vegetables, served with super soft pavs.",
        isVeg: true,
    },
    {
        title: "Cheese Pav Bhaji",
        category: "PavBhaji",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/sdkhg8tkw6xffztxtjgr",
        cost: 160,
        desc : "An all time favorite combo of cheesy pav bhaji, with a striking red bhaji made with Indian spices and assorted vegetables and grated cheese;, served with super soft pavs.",
        isVeg: true,
    },
    {
        title: "Spl Pav Bhaji",
        category: "PavBhaji",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/prnfsopktnagxqzrvw6k",
        cost: 210,
        desc : "A classic north Indian dish with a delicious thick vegetable curry served with pav, made in a special cannon pav bhaji style.",
        isVeg: true,
    },
    {
        title: "Khada Pav Bhaji",
        category: "PavBhaji",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/zqw0j5qf2dagpi5u00hw",
        cost: 170,
        desc : "Unsmash your pav bhaji! khadabhaji+2 butterpav+1papad+onion-lemon",
        isVeg: true,
    },
    {
        title: "Mumbai Tadka Grilled Pav Bhaji",
        category: "PavBhaji",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/zuyb0ntyznxwu8vvclzx",
        cost: 240,
        desc : "Maska masala tadka bhaji + 2 grilled pav + 1 papad + onion-lemon (not available in jain)",
        isVeg: true,
    },
    //Rice & Noodles==================
    {
        title: "Paprika Cheese Rice",
        category: "Continental",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/nvgl56jijn4dclck9uac",
        cost: 300,
        desc : "Flavorful rice filled with Paprika cheese.",
        isVeg: true,
    },
    {
        title: "Thai Red Curry With Flavoured Rice",
        category: "Continental",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/reqm0w3qxts6xnr5fu5l",
        cost: 290,
        desc : "Flavor packed rice accompanied by thick and creamy Thai red curry.",
        isVeg: true,
    },
    {
        title: "Veg Schezwan Noodle",
        category: "Continental",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/gifik7hanpbvg4gwqkhc",
        cost: 240,
        desc : "A delicious dish prepared by tossing veg noodles in a spicy schezwan sauce.",
        isVeg: true,
    },
    {
        title: "Veg Schezwan Fried Rice",
        category: "Continental",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/qe09p5qdjnv1ax39bkw5",
        cost: 250,
        desc : "A slightly spicy dish made by tossing vegetables and rice in a garlic and chilli flavored schezwan sauce.",
        isVeg: true,
    },
    {
        title: "Veg Chopper Rice + Dry",
        category: "Continental",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/etgaft73byxy3kgvlyhi",
        cost: 190,
        desc : "",
        isVeg: true,
    },
    //Beverages==================
    {
        title: "Pepsi 500 ml",
        category: "Beverages",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/v73dbzh71l7haeywdrxl",
        cost: 60,
        desc : "",
        isVeg: true,
    },
    {
        title: "7 Up 500 ml",
        category: "Beverages",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/lpdhsbtoluz7uvflydbr",
        cost: 60,
        desc : "",
        isVeg: true,
    },
    {
        title: "Packaged Water 500 ml",
        category: "Beverages",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/zlh832b8urtit8vsgmfi",
        cost: 30,
        desc : "",
        isVeg: true,
    },
    {
        title: "Sprite (750 Ml)",
        category: "Beverages",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/m8i8iswnrnt81f1fkxwl",
        cost: 70,
        desc : "",
        isVeg: true,
    },
    {
        title: "Thums Up (750 Ml)",
        category: "Beverages",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/tkcev7qu9lt9x3gvzsqd",
        cost: 70,
        desc : "",
        isVeg: true,
    },
    
    //Desserts==================
    {
        title: "Chocolate Mousse",
        category: "Desserts",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/x23wx7p7hlequ4stovdc",
        cost: 99,
        desc : "Creamy chocolate mousse layered with moist chocolate cake.",
        isVeg: true,
    },
    {
        title: "Choco Lava",
        category: "Desserts",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/ledjxwcs2vbfd8rnmsgb",
        cost: 99,
        desc : "Rich chocolate cake with molten chocolate center, served warm.",
        isVeg: true,
    },
    {
        title: "Chocolate Brownie Fudge [Mississippi] + Chocolate Hazelnut [Turkey]",
        category: "Desserts",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/nvoos1duan05tbmuimyp",
        cost: 170,
        desc : "[140 ML Double XL Scoops] 2 Solo Tubs. There's no such thing as too much chocolate. Get, set, feast!",
        isVeg: true,
    },
    {
        title: "Blueberry Cheesecake [Greece] + Red Velvet Cheesecake [San Francisco]",
        category: "Desserts",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/lx05eiybeull9ny7jlju",
        cost: 170,
        desc : "[140 ML Double XL Scoops] 2 Solo Tubs for the times when you crave a double treat!",
        isVeg: true,
    },
    {
        title: "Oreo Milkshake.",
        category: "Desserts",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/ptwsftbed9h3ooghaayw",
        cost: 140,
        desc : "",
        isVeg: true,
    },
    {
        title: "Strawberry Blossom",
        category: "Desserts",
        image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/x5mbcbfkcswy5w0oaoff",
        cost: 160,
        desc : "",
        isVeg: true,
    },





];

function seedDB() {
    //Remove all FoodItems
    FoodItem.remove({}, function(err){
        if(err){
            console.log(err);
        }
    })
    //      console.log("removed FoodItems!");
    //   added FoodItems
    data.forEach(function (seed) {
        FoodItem.create(seed, function (err, FoodItem) {
            if (err) {
                console.log(err);
            } else {
                // console.log(FoodItem);
            }
        });
    });
}

module.exports = seedDB;
