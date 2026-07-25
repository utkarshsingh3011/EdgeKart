import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

const initialProducts = [
  {
    customId: 'esp32',
    name: 'ESP32 DevKit V1',
    category: 'Development Boards',
    brand: 'Espressif Systems',
    price: 649,
    originalPrice: 899,
    rating: 4.9,
    reviewsCount: 128,
    description: 'High-performance dual-core microcontroller with integrated Wi-Fi and Bluetooth, perfect for IoT projects and smart home automation.',
    features: [
      'Dual-core Xtensa 32-bit LX6 Microprocessor',
      'Integrated 802.11 b/g/n Wi-Fi & Bluetooth v4.2 BR/EDR/BLE',
      '4MB SPI Flash memory and 520KB SRAM',
      'Support for ESP-IDF, MicroPython, and Arduino IDE',
    ],
    specifications: {
      'Microcontroller': 'ESP-WROOM-32',
      'Operating Voltage': '3.3V / 5V USB',
      'Flash Memory': '4 MB',
      'SRAM': '520 KB',
      'Clock Speed': '240 MHz',
      'GPIO Pins': '36',
    },
    stock: 15,
    sku: 'EK-ESP32-DEVKITV1',
    packageContents: [
      '1 x ESP32 DevKit V1 Development Board',
      '1 x ESD Anti-Static Protective Shielding Bag',
    ],
    images: ['default', 'pinout', 'dimensions'],
    tags: ['esp32', 'espressif', 'devkit', 'microcontroller', 'wifi', 'bluetooth', 'iot', 'smart home', 'maker'],
    featured: true,
    isBestSeller: true,
    isNewProduct: false,
    isActive: true,
  },
  {
    customId: 'arduino-uno',
    name: 'Arduino Uno R3',
    category: 'Development Boards',
    brand: 'Arduino',
    price: 799,
    originalPrice: 1099,
    rating: 4.8,
    reviewsCount: 342,
    description: 'The industry-standard development board ideal for learning coding, electronics, and rapid physical computing prototyping.',
    features: [
      'Robust ATmega328P 8-bit microcontroller',
      '14 Digital I/O pins (6 support PWM outputs)',
      '6 Dedicated analog inputs',
      'Standard USB type-B interface and 2.1mm DC power jack',
    ],
    specifications: {
      'Microcontroller': 'ATmega328P',
      'Operating Voltage': '5V',
      'Input Voltage': '7-12V',
      'Flash Memory': '32 KB',
      'SRAM': '2 KB',
      'Clock Speed': '16 MHz',
    },
    stock: 20,
    sku: 'EK-ARDUINO-UNO-R3',
    packageContents: [
      '1 x Arduino Uno R3 Compatible Board',
      '1 x Blue USB Type-B Interface Cable (30cm)',
    ],
    images: ['default', 'pinout', 'dimensions'],
    tags: ['arduino', 'uno', 'atmega328p', '8bit', 'learning', 'education', 'starter', 'maker'],
    featured: true,
    isBestSeller: true,
    isNewProduct: false,
    isActive: true,
  },
  {
    customId: 'pi-pico-w',
    name: 'Raspberry Pi Pico W',
    category: 'Development Boards',
    brand: 'Raspberry Pi Foundation',
    price: 499,
    originalPrice: 699,
    rating: 4.7,
    reviewsCount: 95,
    description: 'Flexible, high-performance microcontroller board built on RP2040 silicon with onboard 2.4GHz wireless connectivity.',
    features: [
      'RP2040 microcontroller chip designed by Raspberry Pi',
      'Dual-core ARM Cortex-M0+ processor, flexible clock running up to 133 MHz',
      'Onboard 2.4GHz single-band wireless interface (802.11n)',
      'Drag-and-drop programming using mass storage over USB',
    ],
    specifications: {
      'Microcontroller': 'RP2040',
      'Operating Voltage': '3.3V',
      'Flash Memory': '2 MB',
      'SRAM': '264 KB',
      'Connectivity': '2.4GHz Wi-Fi (802.11n)',
      'GPIO Pins': '26',
    },
    stock: 12,
    sku: 'EK-RASP-PICO-W',
    packageContents: [
      '1 x Raspberry Pi Pico W Board (Pre-soldered headers)',
      '1 x Quick Reference Pinout Sheet',
    ],
    images: ['default', 'pinout', 'dimensions'],
    tags: ['raspberry pi', 'pico', 'rp2040', 'wifi', 'microcontroller', 'embedded', 'python'],
    featured: false,
    isBestSeller: false,
    isNewProduct: true,
    isActive: true,
  },
  {
    customId: 'mq2-sensor',
    name: 'MQ2 Gas Sensor',
    category: 'Sensors',
    brand: 'EdgeKart Sensors',
    price: 199,
    originalPrice: 299,
    rating: 4.6,
    reviewsCount: 52,
    description: 'Gas sensor module designed to detect combustible gases like LPG, propane, methane, hydrogen, and smoke for safety systems.',
    features: [
      'Dual output: Analog (voltage) and Digital (TTL high/low)',
      'Onboard potentiometer for adjustable sensitivity threshold',
      'Fast response time and high sensitivity levels',
      'Stable performance with long-term durability',
    ],
    specifications: {
      'Operating Voltage': '5V DC',
      'Current Draw': '150mA',
      'Detection Gases': 'LPG, Smoke, Alcohol, Propane',
      'Output Type': 'Analog & Digital (TTL)',
      'Preheat Time': '24 Hours',
    },
    stock: 8,
    sku: 'EK-SENS-MQ2-GAS',
    packageContents: [
      '1 x MQ2 Gas Sensor Breakout Board',
      '1 x 4-Pin Female-to-Female Jumper Ribbon Cable',
    ],
    images: ['default', 'pinout', 'dimensions'],
    tags: ['mq2', 'gas', 'smoke', 'sensor', 'safety', 'fire', 'analog', 'digital'],
    featured: false,
    isBestSeller: false,
    isNewProduct: false,
    isActive: true,
  },
  {
    customId: 'dht11',
    name: 'DHT11 Temperature & Humidity Sensor',
    category: 'Sensors',
    brand: 'EdgeKart Sensors',
    price: 149,
    originalPrice: 199,
    rating: 4.5,
    reviewsCount: 84,
    description: 'A basic, low-cost digital temperature and humidity sensor module with a calibrated single-wire digital interface.',
    features: [
      'Calibrated digital signal output',
      'Long-term stability and anti-interference capability',
      'No extra external components required',
      'Includes breakout board and connecting cable',
    ],
    specifications: {
      'Operating Voltage': '3.3V to 5.5V',
      'Humidity Range': '20% to 90% RH (±5% accuracy)',
      'Temperature Range': '0°C to 50°C (±2°C accuracy)',
      'Sampling Rate': '1 Hz (every 1 second)',
      'Interface': 'Single-wire digital',
    },
    stock: 25,
    sku: 'EK-SENS-DHT11-HUM',
    packageContents: [
      '1 x DHT11 Sensor Breakout Module',
      '1 x 3-Pin Female-to-Female Connection Cable',
    ],
    images: ['default', 'pinout', 'dimensions'],
    tags: ['dht11', 'temperature', 'humidity', 'weather', 'environment', 'sensor', 'climate'],
    featured: true,
    isBestSeller: true,
    isNewProduct: false,
    isActive: true,
  },
  {
    customId: 'pir-sensor',
    name: 'HC-SR501 PIR',
    category: 'Sensors',
    brand: 'EdgeKart Sensors',
    price: 159,
    originalPrice: 229,
    rating: 4.6,
    reviewsCount: 67,
    description: 'Pyroelectric infrared motion sensor that detects human presence by sensing changes in ambient infrared radiation.',
    features: [
      'Adjustable delay time (0.3s - 18s) and sensing range',
      'Trigger mode selection (repeatable or single trigger)',
      'Wide operating voltage range with high noise immunity',
      'Automatic temperature compensation',
    ],
    specifications: {
      'Operating Voltage': '4.5V to 20V DC',
      'Sensing Angle': '< 100 degrees cone',
      'Sensing Distance': '3 to 7 meters (adjustable)',
      'Delay Time': '5 seconds to 300 seconds (adjustable)',
      'Block Time': '2.5 seconds',
    },
    stock: 4,
    sku: 'EK-SENS-HCSR501-PIR',
    packageContents: ['1 x HC-SR501 Pyroelectric Infrared Sensor Module'],
    images: ['default', 'pinout', 'dimensions'],
    tags: ['hc-sr501', 'pir', 'motion', 'sensor', 'security', 'presence', 'infrared'],
    featured: false,
    isBestSeller: false,
    isNewProduct: false,
    isActive: true,
  },
  {
    customId: 'oled-display',
    name: 'OLED Display 0.96" I2C',
    category: 'Displays',
    brand: 'EdgeKart Displays',
    price: 299,
    originalPrice: 399,
    rating: 4.9,
    reviewsCount: 110,
    description: 'Ultra-bright 128x64 pixel graphical OLED display with high contrast and extremely low power consumption.',
    features: [
      'Self-illuminating panel (no backlight required)',
      'Simple I2C communication interface using only 4 pins',
      'High contrast ratio for deep black levels',
      'Compatible with Arduino, ESP32, and Raspberry Pi libraries',
    ],
    specifications: {
      'Resolution': '128 x 64 Pixels',
      'Driver IC': 'SSD1306',
      'Interface': 'I2C (Address 0x3C or 0x3D)',
      'Operating Voltage': '3.3V to 5V',
      'Display Color': 'Blue & Yellow',
    },
    stock: 9,
    sku: 'EK-DISP-OLED-096',
    packageContents: [
      '1 x 0.96" I2C OLED Display Module',
      '1 x 4-Pin Straight Make Pin Header (Pre-soldered)',
    ],
    images: ['default', 'pinout', 'dimensions'],
    tags: ['oled', 'screen', 'display', 'i2c', 'ssd1306', '128x64', 'graphics'],
    featured: true,
    isBestSeller: true,
    isNewProduct: true,
    isActive: true,
  },
  {
    customId: 'lcd-16x2',
    name: 'LCD 16x2 Character Display',
    category: 'Displays',
    brand: 'EdgeKart Displays',
    price: 249,
    originalPrice: 349,
    rating: 4.7,
    reviewsCount: 78,
    description: 'Standard 16-character by 2-row monochrome LCD display with blue backlight, perfect for displaying sensor values.',
    features: [
      '16 characters x 2 lines display capacity',
      'Onboard HD44780 equivalent display controller',
      'High-contrast characters with adjustable backlight contrast',
      'Supports 4-bit and 8-bit parallel microprocessor interface',
    ],
    specifications: {
      'Resolution': '16 Characters x 2 Rows',
      'Controller': 'HD44780 or equivalent',
      'Backlight': 'Blue LED',
      'Interface': 'Parallel (4-bit or 8-bit)',
      'Operating Voltage': '5V DC',
    },
    stock: 0,
    sku: 'EK-DISP-LCD1602',
    packageContents: [
      '1 x LCD 16x2 Character Display Module',
      '1 x 16-Pin Breakable Pin Header strip',
    ],
    images: ['default', 'pinout', 'dimensions'],
    tags: ['lcd', 'character', 'screen', 'display', '16x2', 'hd44780', 'parallel'],
    featured: false,
    isBestSeller: false,
    isNewProduct: false,
    isActive: true,
  },
  {
    customId: 'breadboard',
    name: 'Breadboard (830 Points)',
    category: 'Accessories',
    brand: 'EdgeKart Prototyping',
    price: 149,
    originalPrice: 199,
    rating: 4.8,
    reviewsCount: 140,
    description: 'High-quality solderless prototyping board featuring 830 tie-points and double distribution rails for rapid wiring.',
    features: [
      '1 Double terminal strip, Total 630 tie-point holes',
      '2 Double distribution strips, Total 200 tie-point holes',
      'Interlocking tabs to easily connect multiple boards',
      'Self-adhesive backing tape for permanent mounting',
    ],
    specifications: {
      'Total Points': '830 Points',
      'Pitch': '2.54mm (0.1 inch)',
      'Dimensions': '16.5 x 5.5 x 0.85 cm',
      'Material': 'ABS Plastic & Nickel plated clips',
      'Wire Range': '20-29 AWG',
    },
    stock: 30,
    sku: 'EK-ACCE-BB830',
    packageContents: ['1 x 830-Tie Point Prototyping Solderless Breadboard'],
    images: ['default', 'dimensions'],
    tags: ['breadboard', 'solderless', 'prototyping', 'wiring', 'accessory', 'maker'],
    featured: false,
    isBestSeller: false,
    isNewProduct: false,
    isActive: true,
  },
  {
    customId: 'jumper-wires',
    name: 'Jumper Wires (60-Pack)',
    category: 'Accessories',
    brand: 'EdgeKart Prototyping',
    price: 129,
    originalPrice: 179,
    rating: 4.7,
    reviewsCount: 215,
    description: 'Premium multi-colored flexible breadboard connecting wires in Male-to-Male and Male-to-Female combinations.',
    features: [
      'High-grade copper core for superior electrical conductivity',
      'Flexible PVC insulation with durable molded connector boots',
      'Assorted colors for quick circuit debugging and layout',
      'Standard 2.54mm spacing connector pins',
    ],
    specifications: {
      'Wire Count': '60 Wires',
      'Length': '20cm (approx. 8 inches)',
      'Connectors': 'Male-Male & Male-Female mix',
      'Wire Gauge': '26 AWG',
      'Insulation': 'High-flex PVC',
    },
    stock: 50,
    sku: 'EK-ACCE-JUMP60',
    packageContents: [
      '30 x Male-to-Male Jumper Wires (20cm)',
      '30 x Male-to-Female Jumper Wires (20cm)',
    ],
    images: ['default', 'dimensions'],
    tags: ['jumper', 'wires', 'cables', 'breadboard', 'accessory', 'dupont'],
    featured: true,
    isBestSeller: true,
    isNewProduct: false,
    isActive: true,
  },
];

export const seedProducts = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Seeding initial product catalog into MongoDB...');
      // Ensure some items have low stock for admin dashboard validation
      const seeded = initialProducts.map((prod) => {
        if (prod.customId === 'mq2-sensor') return { ...prod, stock: 2 };
        if (prod.customId === 'pi-pico-w') return { ...prod, stock: 3 };
        if (prod.customId === 'dht11') return { ...prod, stock: 4 };
        return prod;
      });
      await Product.insertMany(seeded);
      console.log('\x1b[32mSuccessfully seeded products catalog!\x1b[0m');
    }

    // Seed default users if none exist
    const userCount = await User.countDocuments();
    let defaultUser = null;
    let defaultAdmin = null;

    if (userCount === 0) {
      console.log('Seeding initial admin and demo user accounts...');
      defaultAdmin = await User.create({
        name: 'Admin Developer',
        email: 'admin@edgekart.com',
        password: 'adminpassword123',
        role: 'admin',
        avatar: '⚡'
      });

      defaultUser = await User.create({
        name: 'Utkarsh Sharma',
        email: 'user@edgekart.com',
        password: 'userpassword123',
        role: 'user',
        avatar: '🤖'
      });
      console.log('\x1b[32mSuccessfully seeded default user accounts!\x1b[0m');
    } else {
      defaultUser = await User.findOne({ role: 'user' }) || await User.findOne();
    }

    // Seed sample orders if none exist
    const orderCount = await Order.countDocuments();
    if (orderCount === 0 && defaultUser) {
      console.log('Seeding sample orders for Admin Dashboard...');
      const products = await Product.find().limit(4);
      if (products.length > 0) {
        await Order.create([
          {
            user: defaultUser._id,
            orderNumber: 'EK-ORD-90812',
            status: 'Delivered',
            items: [
              {
                product: products[0]._id,
                name: products[0].name,
                price: products[0].price,
                quantity: 2,
                image: products[0].images[0] || 'default'
              }
            ],
            itemsPrice: products[0].price * 2,
            taxPrice: Math.round(products[0].price * 2 * 0.18),
            shippingPrice: 0,
            discountAmount: 100,
            totalPrice: products[0].price * 2 + Math.round(products[0].price * 2 * 0.18) - 100,
            paymentMethod: 'Online Payment',
            createdAt: new Date(Date.now() - 86400000 * 3)
          },
          {
            user: defaultUser._id,
            orderNumber: 'EK-ORD-90855',
            status: 'Processing',
            items: [
              {
                product: products[1]?._id || products[0]._id,
                name: products[1]?.name || products[0].name,
                price: products[1]?.price || products[0].price,
                quantity: 1,
                image: products[1]?.images[0] || 'default'
              }
            ],
            itemsPrice: products[1]?.price || products[0].price,
            taxPrice: Math.round((products[1]?.price || products[0].price) * 0.18),
            shippingPrice: 99,
            discountAmount: 0,
            totalPrice: (products[1]?.price || products[0].price) + Math.round((products[1]?.price || products[0].price) * 0.18) + 99,
            paymentMethod: 'UPI Payment',
            createdAt: new Date(Date.now() - 86400000 * 1)
          },
          {
            user: defaultUser._id,
            orderNumber: 'EK-ORD-90901',
            status: 'Ordered',
            items: [
              {
                product: products[2]?._id || products[0]._id,
                name: products[2]?.name || products[0].name,
                price: products[2]?.price || products[0].price,
                quantity: 3,
                image: products[2]?.images[0] || 'default'
              }
            ],
            itemsPrice: (products[2]?.price || products[0].price) * 3,
            taxPrice: Math.round((products[2]?.price || products[0].price) * 3 * 0.18),
            shippingPrice: 0,
            discountAmount: 50,
            totalPrice: (products[2]?.price || products[0].price) * 3 + Math.round((products[2]?.price || products[0].price) * 3 * 0.18) - 50,
            paymentMethod: 'Credit Card',
            createdAt: new Date()
          }
        ]);
        console.log('\x1b[32mSuccessfully seeded sample orders!\x1b[0m');
      }
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
};

