import React from 'react';

interface ProductImageProps {
  id: string;
  variant?: 'default' | 'pinout' | 'dimensions';
  className?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({ id, variant = "default", className = "w-full h-full" }) => {
  if (variant === 'pinout') {
    // Custom pinout drawings
    let pinsLeft: string[] = ["VCC", "GND", "GPIO2", "GPIO4", "GPIO5", "RX"];
    let pinsRight: string[] = ["3.3V", "GND", "ADC1", "ADC2", "TX", "GPIO18"];
    let boardName = "ESP32 DevKit";

    if (id === 'arduino-uno') {
      pinsLeft = ["RESET", "3.3V", "5V", "GND", "VIN", "A0"];
      pinsRight = ["D13", "D12", "D11", "D10", "D9", "GND"];
      boardName = "Arduino Uno R3";
    } else if (id === 'pi-pico-w') {
      pinsLeft = ["GP0", "GP1", "GND", "GP2", "GP3", "3V3"];
      pinsRight = ["VBUS", "VSYS", "GND", "3V3_EN", "GP28", "GP27"];
      boardName = "Raspberry Pi Pico W";
    } else if (id === 'mq2-sensor') {
      pinsLeft = ["VCC (5V)", "GND", "AOUT", "DOUT"];
      pinsRight = [];
      boardName = "MQ2 Gas Sensor";
    } else if (id === 'dht11') {
      pinsLeft = ["VCC (5V)", "DATA", "NC", "GND"];
      pinsRight = [];
      boardName = "DHT11 Temp/Hum";
    } else if (id === 'pir-sensor') {
      pinsLeft = ["VCC (5V)", "OUT (TTL)", "GND"];
      pinsRight = [];
      boardName = "HC-SR501 PIR";
    } else if (id === 'oled-display') {
      pinsLeft = ["GND", "VCC (3.3V)", "SCL", "SDA"];
      pinsRight = [];
      boardName = "OLED 0.96\" I2C";
    } else if (id === 'lcd-16x2') {
      pinsLeft = ["VSS", "VDD", "V0 (Cont)", "RS", "RW", "E", "D0", "D1"];
      pinsRight = ["D2", "D3", "D4", "D5", "D6", "D7", "A (Anode)", "K (Cath)"];
      boardName = "LCD 16x2 Character";
    } else {
      // Accessories don't have pinouts, display simplified CAD
      return (
        <svg viewBox="0 0 200 200" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="20" width="160" height="160" rx="8" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
          <rect x="30" y="30" width="140" height="140" rx="5" fill="#1e293b" />
          <path d="M40 70 L160 70 M40 100 L160 100 M40 130 L160 130" stroke="#0f172a" strokeWidth="1" strokeDasharray="3 3" />
          <text x="100" y="104" fill="#60a5fa" fontSize="8" fontWeight="bold" textAnchor="middle">STANDARD COMPONENT</text>
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 200 200" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        {/* PCB Board Outline */}
        <rect x="35" y="25" width="130" height="150" rx="8" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
        <rect x="42" y="32" width="116" height="136" rx="5" fill="#1e293b" fillOpacity="0.4" />

        {/* Schematic Grid Lines */}
        <path d="M 35 55 H 165 M 35 80 H 165 M 35 105 H 165 M 35 130 H 165" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="3 3" />
        <path d="M 65 25 V 175 M 100 25 V 175 M 135 25 V 175" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="3 3" />

        {/* Header Pins Rendering */}
        {/* Left column pinout */}
        {pinsLeft.map((pin, i) => {
          const spacing = pinsRight.length > 0 ? 22 : 30;
          const y = pinsRight.length > 0 ? 30 + i * spacing : 40 + i * spacing;
          const isPower = pin.includes("VCC") || pin.includes("VSS") || pin.includes("VDD") || pin.includes("3.3V") || pin.includes("5V") || pin.includes("VIN");
          const isGnd = pin.includes("GND");
          const badgeColor = isPower ? "#ef4444" : isGnd ? "#334155" : "#0284c7";
          return (
            <g key={i} transform={`translate(0, ${y})`}>
              <rect x="4" y="0" width="38" height="13" rx="2" fill={badgeColor} stroke="#475569" strokeWidth="0.5" />
              <text x="23" y="8.5" fill="#ffffff" fontSize="5.5" fontWeight="bold" textAnchor="middle">{pin}</text>
              <line x1="42" y1="6.5" x2="48" y2="6.5" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="48" cy="6.5" r="1.2" fill="#f59e0b" />
            </g>
          );
        })}

        {/* Right column pinout */}
        {pinsRight.map((pin, i) => {
          const y = 30 + i * 22;
          const isPower = pin.includes("3.3V") || pin.includes("VBUS") || pin.includes("VSYS") || pin.includes("A ");
          const isGnd = pin.includes("GND") || pin.includes("K ");
          const badgeColor = isPower ? "#ef4444" : isGnd ? "#334155" : "#10b981";
          return (
            <g key={i} transform={`translate(158, ${y})`}>
              <rect x="0" y="0" width="38" height="13" rx="2" fill={badgeColor} stroke="#475569" strokeWidth="0.5" />
              <text x="19" y="8.5" fill="#ffffff" fontSize="5.5" fontWeight="bold" textAnchor="middle">{pin}</text>
              <line x1="-10" y1="6.5" x2="0" y2="6.5" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="-10" cy="6.5" r="1.2" fill="#f59e0b" />
            </g>
          );
        })}

        {/* Board Title Label */}
        <rect x="52" y="88" width="96" height="24" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="100" y="99" fill="#60a5fa" fontSize="8" fontWeight="black" textAnchor="middle">{boardName}</text>
        <text x="100" y="108" fill="#94a3b8" fontSize="5.5" fontWeight="bold" textAnchor="middle">PINOUT INTERFACE</text>
      </svg>
    );
  }

  if (variant === 'dimensions') {
    // Dimension values
    let widthText = "48.2 mm";
    let heightText = "27.9 mm";
    let boardWidth = 110;
    let boardHeight = 80;
    let boardName = "ESP32 DevKit";

    if (id === 'arduino-uno') {
      widthText = "68.6 mm";
      heightText = "53.3 mm";
      boardWidth = 130;
      boardHeight = 100;
      boardName = "Arduino Uno R3";
    } else if (id === 'pi-pico-w') {
      widthText = "51.0 mm";
      heightText = "21.0 mm";
      boardWidth = 120;
      boardHeight = 60;
      boardName = "Raspberry Pi Pico W";
    } else if (id === 'mq2-sensor') {
      widthText = "32.0 mm";
      heightText = "22.0 mm";
      boardWidth = 80;
      boardHeight = 70;
      boardName = "MQ2 Gas Sensor";
    } else if (id === 'dht11') {
      widthText = "28.0 mm";
      heightText = "15.0 mm";
      boardWidth = 80;
      boardHeight = 60;
      boardName = "DHT11 Sensor";
    } else if (id === 'pir-sensor') {
      widthText = "32.0 mm";
      heightText = "24.0 mm";
      boardWidth = 80;
      boardHeight = 70;
      boardName = "HC-SR501 PIR";
    } else if (id === 'oled-display') {
      widthText = "27.3 mm";
      heightText = "27.3 mm";
      boardWidth = 90;
      boardHeight = 90;
      boardName = "OLED 0.96\" I2C";
    } else if (id === 'lcd-16x2') {
      widthText = "80.0 mm";
      heightText = "36.0 mm";
      boardWidth = 140;
      boardHeight = 80;
      boardName = "LCD 16x2 Module";
    } else if (id === 'breadboard') {
      widthText = "165.0 mm";
      heightText = "55.0 mm";
      boardWidth = 150;
      boardHeight = 60;
      boardName = "830 Breadboard";
    } else if (id === 'jumper-wires') {
      widthText = "200.0 mm";
      heightText = "1.2 mm";
      boardWidth = 150;
      boardHeight = 40;
      boardName = "Jumper Wires";
    }

    return (
      <svg viewBox="0 0 200 200" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        {/* Blueprint background grid */}
        <rect x="10" y="10" width="180" height="180" fill="#0b0f19" stroke="#1e293b" strokeWidth="1" />
        <path d="M 30 10 V 190 M 60 10 V 190 M 90 10 V 190 M 120 10 V 190 M 150 10 V 190 M 180 10 V 190" stroke="#111827" strokeWidth="0.5" strokeDasharray="3 3" />
        <path d="M 10 30 H 190 M 10 60 H 190 M 10 90 H 190 M 10 120 H 190 M 10 150 H 190 M 10 180 H 190" stroke="#111827" strokeWidth="0.5" strokeDasharray="3 3" />

        {/* Blueprint Board Outline */}
        <g transform="translate(100, 100)">
          <rect
            x={-boardWidth / 2}
            y={-boardHeight / 2}
            width={boardWidth}
            height={boardHeight}
            rx="6"
            fill="none"
            stroke="#2563eb"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          {/* Mount holes at four corners if size allows */}
          {boardHeight > 45 && (
            <>
              <circle cx={-boardWidth / 2 + 10} cy={-boardHeight / 2 + 10} r="3" fill="none" stroke="#38bdf8" strokeWidth="1" />
              <circle cx={boardWidth / 2 - 10} cy={-boardHeight / 2 + 10} r="3" fill="none" stroke="#38bdf8" strokeWidth="1" />
              <circle cx={-boardWidth / 2 + 10} cy={boardHeight / 2 - 10} r="3" fill="none" stroke="#38bdf8" strokeWidth="1" />
              <circle cx={boardWidth / 2 - 10} cy={boardHeight / 2 - 10} r="3" fill="none" stroke="#38bdf8" strokeWidth="1" />
            </>
          )}

          {/* Width Dimension Indicator Arrow */}
          <path
            d={`M ${-boardWidth / 2} ${-boardHeight / 2 - 15} H ${boardWidth / 2}`}
            stroke="#38bdf8"
            strokeWidth="1"
          />
          <path
            d={`M ${-boardWidth / 2} ${-boardHeight / 2 - 15} L ${-boardWidth / 2 + 4} ${-boardHeight / 2 - 18} M ${-boardWidth / 2} ${-boardHeight / 2 - 15} L ${-boardWidth / 2 + 4} ${-boardHeight / 2 - 12}`}
            stroke="#38bdf8"
            strokeWidth="1"
          />
          <path
            d={`M ${boardWidth / 2} ${-boardHeight / 2 - 15} L ${boardWidth / 2 - 4} ${-boardHeight / 2 - 18} M ${boardWidth / 2} ${-boardHeight / 2 - 15} L ${boardWidth / 2 - 4} ${-boardHeight / 2 - 12}`}
            stroke="#38bdf8"
            strokeWidth="1"
          />
          <text x="0" y={-boardHeight / 2 - 20} fill="#38bdf8" fontSize="6.5" fontWeight="bold" textAnchor="middle">{widthText}</text>

          {/* Height Dimension Indicator Arrow */}
          <path
            d={`M ${boardWidth / 2 + 15} ${-boardHeight / 2} V ${boardHeight / 2}`}
            stroke="#38bdf8"
            strokeWidth="1"
          />
          <path
            d={`M ${boardWidth / 2 + 15} ${-boardHeight / 2} L ${boardWidth / 2 + 12} ${-boardHeight / 2 + 4} M ${boardWidth / 2 + 15} ${-boardHeight / 2} L ${boardWidth / 2 + 18} ${-boardHeight / 2 + 4}`}
            stroke="#38bdf8"
            strokeWidth="1"
          />
          <path
            d={`M ${boardWidth / 2 + 15} ${boardHeight / 2} L ${boardWidth / 2 + 12} ${boardHeight / 2 - 4} M ${boardWidth / 2 + 15} ${boardHeight / 2} L ${boardWidth / 2 + 18} ${boardHeight / 2 - 4}`}
            stroke="#38bdf8"
            strokeWidth="1"
          />
          <text
            x={boardWidth / 2 + 22}
            y="0"
            fill="#38bdf8"
            fontSize="6.5"
            fontWeight="bold"
            transform={`rotate(90 ${boardWidth / 2 + 22} 0)`}
            textAnchor="middle"
          >
            {heightText}
          </text>

          {/* Title on blueprint */}
          <text x="0" y="-5" fill="#3b82f6" fontSize="7.5" fontWeight="black" textAnchor="middle">{boardName}</text>
          <text x="0" y="7" fill="#94a3b8" fontSize="5.5" fontWeight="bold" textAnchor="middle">CAD BLUEPRINT</text>
        </g>
      </svg>
    );
  }

  switch (id) {
    case 'esp32':
      return (
        <svg viewBox="0 0 200 200" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* PCB Board */}
          <rect x="25" y="15" width="150" height="170" rx="10" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
          <rect x="30" y="20" width="140" height="160" rx="6" fill="#0f172a" />

          {/* Copper Traces */}
          <path d="M40 50 H160 M40 80 H160 M40 110 H160 M40 140 H160" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M80 20 V180 M120 20 V180" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />

          {/* Wi-Fi Antenna Trace */}
          <rect x="70" y="25" width="60" height="25" rx="3" fill="#1e293b" />
          <path d="M75 37 H125 M75 32 V42 M85 32 V42 M95 32 V42 M105 32 V42 M115 32 V42 M125 32 V42" stroke="#e2e8f0" strokeWidth="1.5" />

          {/* ESP-WROOM-32 Metal Shield */}
          <rect x="55" y="65" width="90" height="70" rx="4" fill="url(#metalGradient)" stroke="#94a3b8" strokeWidth="1" />
          <rect x="65" y="75" width="70" height="50" rx="2" fill="#334155" />
          <text x="100" y="98" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">ESP32</text>
          <text x="100" y="112" fill="#94a3b8" fontSize="6" textAnchor="middle">WROOM-32D</text>

          {/* CPU / SoC (Underneath effect, glowing edge) */}
          <rect x="90" y="145" width="20" height="20" rx="2" fill="#111827" stroke="#3b82f6" strokeWidth="1.5" />
          <circle cx="100" cy="155" r="2" fill="#3b82f6" />

          {/* Micro-USB Port */}
          <rect x="85" y="180" width="30" height="12" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
          <rect x="92" y="185" width="16" height="7" fill="#1e293b" />

          {/* Golden Pin Header Pads */}
          {Array.from({ length: 15 }).map((_, i) => (
            <g key={i}>
              {/* Left Pin Pads */}
              <circle cx="32" cy={35 + i * 10} r="2.5" fill="#f59e0b" />
              <rect x="36" y={33.5 + i * 10} width="6" height="3" fill="#f59e0b" />
              {/* Right Pin Pads */}
              <circle cx="168" cy={35 + i * 10} r="2.5" fill="#f59e0b" />
              <rect x="158" y={33.5 + i * 10} width="6" height="3" fill="#f59e0b" />
            </g>
          ))}

          {/* Components / Resistors */}
          <rect x="145" y="65" width="4" height="6" fill="#ef4444" />
          <rect x="145" y="75" width="4" height="6" fill="#10b981" />
          <rect x="145" y="85" width="4" height="6" fill="#3b82f6" />
          <circle cx="50" cy="155" r="3" fill="#ef4444" />
          <text x="50" y="166" fill="#ef4444" fontSize="5" textAnchor="middle" fontWeight="bold">EN</text>
          <circle cx="150" cy="155" r="3" fill="#3b82f6" />
          <text x="150" y="166" fill="#3b82f6" fontSize="5" textAnchor="middle" fontWeight="bold">BOOT</text>

          <defs>
            <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'arduino-uno':
      return (
        <svg viewBox="0 0 200 200" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Blue PCB Board */}
          <rect x="15" y="25" width="170" height="150" rx="8" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
          <rect x="20" y="30" width="160" height="140" rx="5" fill="#1d4ed8" />

          {/* USB Type B Port */}
          <rect x="10" y="40" width="35" height="30" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
          <rect x="5" y="47" width="5" height="16" rx="1" fill="#475569" />

          {/* DC Power Jack */}
          <rect x="12" y="110" width="40" height="25" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          <circle cx="12" cy="122.5" r="5" fill="#1e293b" />

          {/* ATmega328P Chip (DIP-28) */}
          <rect x="75" y="90" width="90" height="25" rx="2" fill="#111827" stroke="#334155" strokeWidth="1" />
          <circle cx="80" cy="102.5" r="2.5" fill="#374151" />
          <text x="120" y="106" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle" letterSpacing="1">ATMEGA328P</text>
          {/* Pins for ATmega */}
          {Array.from({ length: 14 }).map((_, i) => (
            <g key={i}>
              <line x1={80 + i * 6} y1="87" x2={80 + i * 6} y2="90" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1={80 + i * 6} y1="115" x2={80 + i * 6} y2="118" stroke="#cbd5e1" strokeWidth="1.5" />
            </g>
          ))}

          {/* Connectors (Female Headers) */}
          {/* Digital Header (Top) */}
          <rect x="65" y="35" width="110" height="10" rx="1" fill="#0f172a" />
          {Array.from({ length: 10 }).map((_, i) => (
            <rect key={i} x={69 + i * 10} y="37" width="6" height="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="0.5" />
          ))}
          <text x="120" y="32" fill="#e2e8f0" fontSize="5" textAnchor="middle">DIGITAL (PWM ~)</text>

          {/* Analog / Power Headers (Bottom) */}
          <rect x="65" y="155" width="55" height="10" rx="1" fill="#0f172a" />
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x={68 + i * 8} y="157" width="5" height="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="0.5" />
          ))}
          <text x="92" y="171" fill="#e2e8f0" fontSize="5" textAnchor="middle">POWER</text>

          <rect x="125" y="155" width="50" height="10" rx="1" fill="#0f172a" />
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x={128 + i * 8} y="157" width="5" height="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="0.5" />
          ))}
          <text x="150" y="171" fill="#e2e8f0" fontSize="5" textAnchor="middle">ANALOG IN</text>

          {/* Crystal Oscillator */}
          <rect x="58" y="75" width="14" height="8" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
          <text x="65" y="81" fill="#475569" fontSize="4" textAnchor="middle" fontWeight="bold">16.0</text>

          {/* Built-in LED */}
          <circle cx="155" cy="55" r="2.5" fill="#f59e0b" />
          <text x="155" y="64" fill="#94a3b8" fontSize="5" textAnchor="middle">L</text>

          {/* Arduino Logo Graphic */}
          <circle cx="150" cy="130" r="8" stroke="#3b82f6" strokeWidth="2" />
          <circle cx="160" cy="130" r="8" stroke="#3b82f6" strokeWidth="2" />
          <text x="155" y="132" fill="#3b82f6" fontSize="6" fontWeight="bold" textAnchor="middle">∞</text>
        </svg>
      );

    case 'pi-pico-w':
      return (
        <svg viewBox="0 0 200 200" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Green PCB Board */}
          <rect x="35" y="15" width="130" height="170" rx="6" fill="#065f46" stroke="#10b981" strokeWidth="2" />
          <rect x="40" y="20" width="120" height="160" rx="4" fill="#047857" />

          {/* RP2040 Main Chip */}
          <rect x="85" y="90" width="30" height="30" rx="3" fill="#111827" stroke="#047857" strokeWidth="1.5" />
          <circle cx="100" cy="105" r="8" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" />
          <text x="100" y="108" fill="#e2e8f0" fontSize="8" fontWeight="bold" textAnchor="middle">RP2</text>

          {/* Raspberry Pi Logo (Flower style icon representation) */}
          <circle cx="100" cy="140" r="6" fill="#be123c" />
          <circle cx="95" cy="135" r="4" fill="#be123c" />
          <circle cx="105" cy="135" r="4" fill="#be123c" />
          <path d="M96 128 C98 126 102 126 104 128" stroke="#047857" strokeWidth="2" strokeLinecap="round" />

          {/* Wi-Fi Metallic Module (Pico W) */}
          <rect x="75" y="45" width="50" height="35" rx="3" fill="url(#metalGrad)" stroke="#94a3b8" strokeWidth="1" />
          <text x="100" y="65" fill="#334155" fontSize="7" fontWeight="bold" textAnchor="middle">WIRELESS</text>

          {/* Micro USB Port */}
          <rect x="85" y="10" width="30" height="12" rx="1.5" fill="#64748b" stroke="#cbd5e1" strokeWidth="1" />
          <rect x="91" y="13" width="18" height="9" fill="#1e293b" />

          {/* Castellation Pins along sides */}
          {Array.from({ length: 20 }).map((_, i) => (
            <g key={i}>
              {/* Left pins */}
              <rect
                x={33}
                y={25 + i * 7.5}
                width={7}
                height={3.5}
                fill="#f59e0b"
                rx={0.5}
              />
              <circle
                cx={36.5}
                cy={26.75 + i * 7.5}
                r={1}
                fill="#0f172a"
              />

              {/* Right pins */}
              <rect
                x={160}
                y={25 + i * 7.5}
                width={7}
                height={3.5}
                fill="#f59e0b"
                rx={0.5}
              />
              <circle
                cx={163.5}
                cy={26.75 + i * 7.5}
                r={1}
                fill="#0f172a"
              />
            </g>
          ))}

          {/* BOOTSEL Button */}
          <rect x="52" y="40" width="10" height="10" rx="5" fill="#0f172a" />
          <circle cx="57" cy="45" r="3.5" fill="#e2e8f0" />
          <text x="57" y="58" fill="#e2e8f0" fontSize="5" textAnchor="middle">BOOT</text>

          {/* LED */}
          <circle cx="57" cy="70" r="2.5" fill="#10b981" />
          <text x="57" y="79" fill="#94a3b8" fontSize="5" textAnchor="middle">LED</text>

          <defs>
            <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'dht11':
      return (
        <svg viewBox="0 0 200 200" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Blue Module PCB */}
          <rect x="40" y="60" width="120" height="110" rx="6" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />

          {/* Humidity Sensor Casing (Blue grid grill box) */}
          <rect x="55" y="25" width="90" height="95" rx="5" fill="#3b82f6" stroke="#2563eb" strokeWidth="1" />
          {/* Grill Lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={i} x1="65" y1={35 + i * 16} x2="135" y2={35 + i * 16} stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round" />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={i} x1={65 + i * 17} y1="35" x2={65 + i * 17} y2="110" stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round" />
          ))}

          {/* Pins at the bottom */}
          <rect x="80" y="160" width="40" height="28" fill="#1e293b" rx="2" />
          <line x1="90" y1="165" x2="90" y2="195" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
          <line x1="100" y1="165" x2="100" y2="195" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
          <line x1="110" y1="165" x2="110" y2="195" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />

          {/* Resistors on PCB */}
          <rect x="50" y="130" width="12" height="6" fill="#374151" />
          <rect x="52" y="132" width="8" height="2" fill="#10b981" />

          <rect x="138" y="130" width="12" height="6" fill="#374151" />
          <rect x="140" y="132" width="8" height="2" fill="#ef4444" />

          {/* Indicator LED */}
          <circle cx="100" cy="140" r="3" fill="#ef4444" />
          <text x="100" y="152" fill="#cbd5e1" fontSize="6" textAnchor="middle">DHT11</text>
        </svg>
      );

    case 'mq2-sensor':
      return (
        <svg viewBox="0 0 200 200" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Blue Circular PCB */}
          <circle cx="100" cy="100" r="80" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
          <circle cx="100" cy="100" r="74" fill="#1d4ed8" />

          {/* Inner Sensor Dome Base */}
          <circle cx="100" cy="100" r="50" fill="#0f172a" stroke="#334155" strokeWidth="2" />

          {/* Metal Mesh Grill (represented by concentric circles and radial lines) */}
          <circle cx="100" cy="100" r="42" fill="url(#meshPattern)" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="30" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="18" stroke="#cbd5e1" strokeWidth="1" />
          <circle cx="100" cy="100" r="6" fill="#475569" />

          {/* Radial Spokes */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI) / 4;
            const x2 = 100 + Math.cos(angle) * 42;
            const y2 = 100 + Math.sin(angle) * 42;
            return <line key={i} x1="100" y1="100" x2={x2} y2={y2} stroke="#64748b" strokeWidth="1.5" />;
          })}

          {/* Pins extending out from side/bottom (represented visually in perspective) */}
          <g transform="translate(0, 10)">
            <rect x="80" y="165" width="40" height="15" fill="#334155" rx="1" />
            <line x1="88" y1="172" x2="88" y2="192" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="96" y1="172" x2="96" y2="192" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="104" y1="172" x2="104" y2="192" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="112" y1="172" x2="112" y2="192" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Status Indicators */}
          <circle cx="50" cy="100" r="4" fill="#ef4444" />
          <text x="50" y="112" fill="#cbd5e1" fontSize="6" textAnchor="middle">PWR</text>
          <circle cx="150" cy="100" r="4" fill="#10b981" />
          <text x="150" y="112" fill="#cbd5e1" fontSize="6" textAnchor="middle">DOUT</text>

          <text x="100" y="42" fill="#e2e8f0" fontSize="8" fontWeight="bold" textAnchor="middle" letterSpacing="1">MQ-2</text>

          <defs>
            <radialGradient id="meshPattern" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="70%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </radialGradient>
          </defs>
        </svg>
      );

    case 'pir-sensor':
      return (
        <svg viewBox="0 0 200 200" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Green PCB Board */}
          <rect x="35" y="45" width="130" height="130" rx="8" fill="#065f46" stroke="#10b981" strokeWidth="2" />
          <rect x="40" y="50" width="120" height="120" rx="6" fill="#047857" />

          {/* White Fresnel Lens Dome (Concentric segmented circles) */}
          <circle cx="100" cy="105" r="45" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
          <circle cx="100" cy="105" r="35" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 2" />
          <circle cx="100" cy="105" r="25" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="100" cy="105" r="15" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="100" cy="105" r="5" fill="#cbd5e1" />

          {/* Segmented Lens Facets (Radial lines) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * Math.PI) / 6;
            const x1 = 100 + Math.cos(angle) * 5;
            const x2 = 100 + Math.cos(angle) * 45;
            const y1 = 105 + Math.sin(angle) * 5;
            const y2 = 105 + Math.sin(angle) * 45;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cbd5e1" strokeWidth="0.75" opacity="0.6" />;
          })}

          {/* Pins at the bottom */}
          <line x1="90" y1="175" x2="90" y2="195" stroke="#cbd5e1" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="100" y1="175" x2="100" y2="195" stroke="#cbd5e1" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="110" y1="175" x2="110" y2="195" stroke="#cbd5e1" strokeWidth="3.5" strokeLinecap="round" />

          <text x="100" y="32" fill="#e2e8f0" fontSize="8" fontWeight="bold" textAnchor="middle" letterSpacing="1">HC-SR501</text>
        </svg>
      );

    case 'oled-display':
      return (
        <svg viewBox="0 0 200 200" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Black PCB Board */}
          <rect x="25" y="35" width="150" height="130" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />

          {/* OLED Screen (Glass Frame) */}
          <rect x="35" y="55" width="130" height="85" rx="4" fill="#020617" stroke="#475569" strokeWidth="1.5" />

          {/* Glowing display area */}
          <rect x="40" y="60" width="120" height="75" rx="2" fill="#090d16" />

          {/* Screen Content - Glowing Blue Wave/Data */}
          {/* Sine Wave */}
          <path d="M45 100 Q 60 70, 75 100 T 105 100 T 135 100 T 155 100" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" className="drop-shadow-[0_0_4px_#3b82f6]" />

          {/* Status text on OLED */}
          <text x="45" y="75" fill="#3b82f6" fontSize="8" fontFamily="monospace" fontWeight="bold">I2C OLED 128x64</text>
          <text x="45" y="125" fill="#60a5fa" fontSize="7" fontFamily="monospace">Temp: 24.5C</text>
          <text x="115" y="125" fill="#60a5fa" fontSize="7" fontFamily="monospace">Hum: 52%</text>

          {/* Top I2C Connection Pins */}
          <rect x="75" y="25" width="50" height="10" rx="1.5" fill="#0f172a" />
          {Array.from({ length: 4 }).map((_, i) => (
            <g key={i}>
              <circle cx={81.5 + i * 12} cy="30" r="2" fill="#f59e0b" />
              <line x1={81.5 + i * 12} y1="30" x2={81.5 + i * 12} y2="15" stroke="#cbd5e1" strokeWidth="2" />
            </g>
          ))}
          {/* Pin labels */}
          <text x="81.5" y="44" fill="#cbd5e1" fontSize="4.5" textAnchor="middle">GND</text>
          <text x="93.5" y="44" fill="#cbd5e1" fontSize="4.5" textAnchor="middle">VCC</text>
          <text x="105.5" y="44" fill="#cbd5e1" fontSize="4.5" textAnchor="middle">SCL</text>
          <text x="117.5" y="44" fill="#cbd5e1" fontSize="4.5" textAnchor="middle">SDA</text>
        </svg>
      );

    case 'breadboard':
      return (
        <svg viewBox="0 0 200 200" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Breadboard Base (Cream/Light Beige colored) */}
          <rect x="15" y="35" width="170" height="130" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />

          {/* Middle Divider Ridge */}
          <rect x="15" y="96" width="170" height="8" fill="#e2e8f0" />

          {/* Power Rails (Red and Blue Lines) */}
          {/* Top Rail */}
          <line x1="20" y1="45" x2="180" y2="45" stroke="#ef4444" strokeWidth="1" />
          <line x1="20" y1="52" x2="180" y2="52" stroke="#3b82f6" strokeWidth="1" />
          {/* Bottom Rail */}
          <line x1="20" y1="148" x2="180" y2="148" stroke="#3b82f6" strokeWidth="1" />
          <line x1="20" y1="155" x2="180" y2="155" stroke="#ef4444" strokeWidth="1" />

          {/* Tie Point Holes */}
          {/* Rails holes */}
          {Array.from({ length: 15 }).map((_, i) => (
            <g key={i}>
              {/* Top rails */}
              <circle cx={25 + i * 10} cy="45" r="1.25" fill="#475569" />
              <circle cx={25 + i * 10} cy="52" r="1.25" fill="#475569" />
              {/* Bottom rails */}
              <circle cx={25 + i * 10} cy="148" r="1.25" fill="#475569" />
              <circle cx={25 + i * 10} cy="155" r="1.25" fill="#475569" />
            </g>
          ))}

          {/* Prototyping Columns (A-E and F-J) */}
          {Array.from({ length: 15 }).map((_, col) => (
            <g key={col}>
              {/* Top half: 5 rows */}
              {Array.from({ length: 5 }).map((_, row) => (
                <circle key={row} cx={25 + col * 10} cy={62 + row * 6} r="1.25" fill="#475569" />
              ))}
              {/* Bottom half: 5 rows */}
              {Array.from({ length: 5 }).map((_, row) => (
                <circle key={row} cx={25 + col * 10} cy={108 + row * 6} r="1.25" fill="#475569" />
              ))}
            </g>
          ))}

          {/* Visual labels */}
          <text x="10" y="65" fill="#94a3b8" fontSize="6" fontFamily="monospace">A</text>
          <text x="10" y="89" fill="#94a3b8" fontSize="6" fontFamily="monospace">E</text>
          <text x="10" y="111" fill="#94a3b8" fontSize="6" fontFamily="monospace">F</text>
          <text x="10" y="135" fill="#94a3b8" fontSize="6" fontFamily="monospace">J</text>

          <text x="100" y="165" fill="#94a3b8" fontSize="5" textAnchor="middle">SOLDERLESS BREADBOARD</text>
        </svg>
      );

    case 'jumper-wires':
      return (
        <svg viewBox="0 0 200 200" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Background Dark Card area */}
          <rect x="20" y="20" width="160" height="160" rx="10" fill="#0f172a" opacity="0.3" />

          {/* Jumper Wires - Flowy, curved colored lines */}
          <path d="M40 50 C 70 20, 130 30, 160 80" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M45 70 C 75 40, 125 50, 155 100" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M35 90 C 70 70, 110 80, 140 130" stroke="#10b981" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M50 110 C 80 90, 120 100, 150 150" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M55 130 C 90 110, 110 130, 130 170" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" fill="none" />

          {/* Black plastic connector housings at ends */}
          {/* Left Connectors */}
          <rect x="37" y="44" width="6" height="12" rx="1" fill="#1e293b" transform="rotate(-30, 37, 44)" />
          <line x1="39" y1="40" x2="35" y2="30" stroke="#cbd5e1" strokeWidth="1.5" />

          <rect x="42" y="64" width="6" height="12" rx="1" fill="#1e293b" transform="rotate(-30, 42, 64)" />
          <line x1="44" y1="60" x2="40" y2="50" stroke="#cbd5e1" strokeWidth="1.5" />

          <rect x="32" y="84" width="6" height="12" rx="1" fill="#1e293b" transform="rotate(-20, 32, 84)" />

          <rect x="47" y="104" width="6" height="12" rx="1" fill="#1e293b" transform="rotate(-20, 47, 104)" />

          {/* Right Connectors */}
          <rect x="156" y="74" width="6" height="12" rx="1" fill="#1e293b" transform="rotate(30, 156, 74)" />
          <line x1="160" y1="84" x2="164" y2="94" stroke="#cbd5e1" strokeWidth="1.5" />

          <rect x="151" y="94" width="6" height="12" rx="1" fill="#1e293b" transform="rotate(30, 151, 94)" />
          <line x1="155" y1="104" x2="159" y2="114" stroke="#cbd5e1" strokeWidth="1.5" />

          <rect x="136" y="124" width="6" height="12" rx="1" fill="#1e293b" transform="rotate(40, 136, 124)" />
          <line x1="141" y1="134" x2="147" y2="144" stroke="#cbd5e1" strokeWidth="1.5" />

          <rect x="146" y="144" width="6" height="12" rx="1" fill="#1e293b" transform="rotate(45, 146, 144)" />

          <text x="100" y="165" fill="#94a3b8" fontSize="6" textAnchor="middle" fontWeight="bold">PREMIUM WIRE PACK</text>
        </svg>
      );

    case 'lcd-16x2':
      return (
        <svg viewBox="0 0 200 200" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Green PCB Board */}
          <rect x="15" y="45" width="170" height="110" rx="4" fill="#065f46" stroke="#059669" strokeWidth="2" />

          {/* LCD Bezel (Metal Frame) */}
          <rect x="25" y="60" width="150" height="80" rx="3" fill="#334155" stroke="#475569" strokeWidth="1" />

          {/* Active Liquid Crystal Screen Backlight (Blue glow) */}
          <rect x="32" y="67" width="136" height="66" rx="1" fill="#2563eb" />

          {/* Grid lines inside the LCD display screen */}
          <rect x="36" y="72" width="128" height="56" fill="#1e3a8a" />

          {/* Text on Screen */}
          <text x="42" y="93" fill="#60a5fa" fontSize="8" fontFamily="monospace" fontWeight="bold" letterSpacing="0.5">EDGEKART 16X2 LCD</text>
          <text x="42" y="113" fill="#60a5fa" fontSize="7" fontFamily="monospace" fontWeight="bold" letterSpacing="0.5">SYSTEM ACTIVE...</text>

          {/* 16 Pin Headers at top left */}
          {Array.from({ length: 16 }).map((_, i) => (
            <g key={i}>
              <circle cx={27 + i * 9.2} cy="52" r="1.8" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />
              <line x1={27 + i * 9.2} y1="52" x2={27 + i * 9.2} y2="47" stroke="#f59e0b" strokeWidth="1" />
            </g>
          ))}
          {/* Contrast adjusting Trimpot */}
          <rect x="150" y="125" width="12" height="12" rx="2" fill="#0284c7" stroke="#cbd5e1" strokeWidth="0.5" />
          <circle cx="156" cy="131" r="3.5" fill="#f8fafc" />
          <path d="M154 131 H158 M156 129 V133" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 200 200" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="20" width="160" height="160" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
          <circle cx="100" cy="100" r="40" stroke="#3b82f6" strokeWidth="3" />
          <text x="100" y="104" fill="#e2e8f0" fontSize="12" textAnchor="middle" fontWeight="bold">IoT</text>
        </svg>
      );
  }
};
