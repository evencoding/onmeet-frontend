1. 클라이언트 상태관리 대폭 개선 
   - 같은 페이지 내에 여러 개의 화상 채팅창이 있고, 각 채팅창마다 독립적인 상태가 필요할 때. 이때는 Store를 Context를 통해 주입
   - 내 마이크 상태, 카메라 상태, 참여자 명단 UI 등 Zustand 사용
   - AI가 실시간으로 뱉어내는 STT 데이터 Ref나 외부 저장소에 쌓아두고, 일정 주기(예: 500ms)나 문장이 완성될 때만 상태를 업데이트하는 Throttling 전략
   - SSE 데이터를 상태 관리에 녹이기
     - Buffer (참조 유지): SSE로 오는 raw 데이터는 리액트 상태(useState)가 아닌 일반 변수나 useRef에 담기
     - Throttling (업데이트 제한): 렌더링은 200ms~300ms 주기로 끊어서 수행하거나, 문장이 끝나는 시점(\n)에만 상태를 업데이트
     - Tanstack Query 연동: SSE 스트림이 종료되면, 최종 완성된 전체 회의록 데이터를 queryClient.invalidateQueries를 통해 서버 데이터와 동기화(Snapshot)
2. 타입 관리 대폭 개선
   - 
3. 스트림으로 받는 파일 자료들 대폭 개선
   - 이미지 및 소형 파일: URL.createObjectURL 활용
     - responseType: 'blob'으로 데이터를 받은 뒤 URL.createObjectURL(blob) 사용
   - 대용량 녹음본 및 문서: FileSystemWritableFileStream
     - (File System Access API: 브라우저의 메모리를 거치지 않고 사용자의 하드디스크에 직접 스트림을 쓰는 방식
   - 실시간 진행률 표시 (Progress Tracking)
     - fetch의 response.body.getReader()를 사용해 전체 Content-Length 대비 현재 읽어들인 바이트를 계산
4. 디자인 패턴 적용
   - VAC 패턴 (View Asset Component) 로직과 스타일을 철저히 분리
   - Compound Components 패턴 Prop Drilling(프롭 내려꽂기)을 방지하고 UI 유연성을 확보