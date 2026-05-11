import L from "leaflet";

export const InstituteMarkerIcon =L.divIcon({
    html: `
      <div style="
        position: relative;
        width: 45px;
        height: 55px;
        animation: float 3s ease-in-out infinite;
      ">
        <!-- Rotating colorful marker-shaped ring -->
        <div style="
          position: absolute;
          top: 0;
          left: 50%;
          width: 30px;
          height: 31px;
          transform: translateX(-50%) rotate(-45deg);
          border-radius: 50% 50% 50% 50%;
          background: conic-gradient(
            from 0deg,
            #fbbf24 0deg 90deg,
            #10b981 90deg 180deg,
            #3b82f6 180deg 270deg,
            #ef4444 270deg 360deg
          );
          
          z-index: 1;
          animation: rotate 8s linear infinite;
          opacity: 0.1
          filter: blur(1px);
        "></div>

        <!-- Main marker shape -->
        <div style="
          position: absolute;
          top: 5px;
          left: 50%;
          width: 25px;
          height: 25px;
          background: linear-gradient(135deg, #f5f7fa 0%, #e0e7ff 100%);
          border-radius: 50% 50% 50% 0;
          transform: translateX(-50%) rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          
        ">
          <span style="
            font-size: 18px;
            transform: rotate(45deg);
          ">🎓</span>
        </div>

        <!-- Glowing halo -->
        <div style="
          position: absolute;
          top: 2px;
          left: 50%;
          width: 41px;
          height: 41px;
          transform: translateX(-50%) rotate(-45deg);
          border-radius: 50% 50% 50% 0;
        "></div>

      </div>
      <style>
        @keyframes rotate {
          from { transform: translateX(-50%) rotate(-45deg); }
          to { transform: translateX(-50%) rotate(315deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      </style>
    `,
    className: "", 
    iconSize: [45, 55],
    iconAnchor: [22, 50],
    popupAnchor: [0, -50]
  });