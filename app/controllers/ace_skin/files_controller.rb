module AceSkin
  class FilesController < ::ApplicationController

      def create
          # render json: {}
        render json: {url: AceSkin::Uploader.instance.fast_upload(params[:ace_file].tempfile.path)}
      end

  end
end
